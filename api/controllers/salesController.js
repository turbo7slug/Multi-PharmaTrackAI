const pool = require('../db');

// Controller to add a sale
const addSale = async (req, res) => {
    const { product_id, quantity_sold, customer_name = 'Unknown', sale_date } = req.body;

    try {
        // Check if the product exists and get the sale price and inventory details
        const productInventory = await pool.query(
            `SELECT 
                p.sale_price, 
                i.quantity AS available_quantity 
            FROM products p 
            JOIN inventory i ON p.product_id = i.product_id 
            WHERE p.product_id = $1`,
            [product_id]
        );

        if (productInventory.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found in inventory' });
        }

        const availableQuantity = productInventory.rows[0].available_quantity;
        const salePrice = productInventory.rows[0].sale_price;

        // Check if there's enough stock to make the sale
        if (availableQuantity < quantity_sold) {
            return res.status(400).json({ error: 'Insufficient stock to complete the sale' });
        }

        // Calculate total amount
        const totalAmount = salePrice * quantity_sold;

        // Start a transaction to insert the sale and update the inventory
        await pool.query('BEGIN');

        // Insert the sale into the sales table
        await pool.query(
            'INSERT INTO sales (product_id, quantity_sold, sale_date, total_amount, customer_name) VALUES ($1, $2, $3, $4, $5)',
            [product_id, quantity_sold, sale_date, totalAmount, customer_name]
        );

        // Update the inventory to reflect the sold quantity
        await pool.query(
            'UPDATE inventory SET quantity = quantity - $1 WHERE product_id = $2',
            [quantity_sold, product_id]
        );

        // Commit the transaction
        await pool.query('COMMIT');

        res.status(201).json({ message: 'Sale recorded successfully' });
    } catch (err) {
        // Rollback in case of error
        await pool.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};


// Get all sales
const getAllSales = async (req, res) => {
    try {
        const sales = await pool.query('SELECT * FROM sales ORDER BY sale_date DESC LIMIT 20');
        res.json(sales.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get particular sale by ID
const getSaleById = async (req, res) => {
    const { sale_id } = req.params;
    try {
        const sale = await pool.query('SELECT * FROM sales WHERE sale_id = $1', [sale_id]);

        if (sale.rows.length === 0) {
            return res.status(404).json({ error: 'Sale not found' });
        }

        res.json(sale.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { addSale, getAllSales, getSaleById};
