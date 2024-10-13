import React, { useEffect, useState } from 'react';
import { getAllSales } from '../../api/salesApi';
import { getProductByID } from '../../api/productApi'; // Import the function to get product details

const SalesList = () => {
    const [salesWithProductNames, setSalesWithProductNames] = useState([]);  // Cached sales data
    const [loading, setLoading] = useState(true);
    const [hasFetched, setHasFetched] = useState(false);  // Track if data has been fetched
    const [data, setData] = useState([]);

    // Fetch sales and map product names only once
    useEffect(() => {
        if (!hasFetched) {
            const fetchSales = async () => {
                try {
                    const salesResponse = await getAllSales();
                    const salesData = salesResponse.data;

                    // For each sale, fetch the corresponding product name by product_id
                    const salesWithNames = await Promise.all(
                        salesData.map(async (sale) => {
                            try {
                                // Fetch the product by its ID
                                const productResponse = await getProductByID(sale.product_id);
                                const product = productResponse.data;
                                return { ...sale, product_name: product.product_name };
                            } catch (error) {
                                console.error('Error fetching product name:', error);
                                return { ...sale, product_name: 'Unknown' };
                            }
                        })
                    );

                    setSalesWithProductNames(salesWithNames);
                    setData(salesWithNames);
                    setLoading(false);
                    setHasFetched(true);  // Mark as fetched to avoid re-fetching
                } catch (error) {
                    console.error('Error fetching sales:', error);
                }
            };

            fetchSales();
        }
    }, [hasFetched]);  // Only fetch if not already fetched

    console.log([hasFetched]);

    if (loading) return <div>Loading sales...</div>;

    // Get the index of the latest entry in the sales list
    const latestIndex = salesWithProductNames.length - 1;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Sales List</h2>
            <ul className="space-y-4">
                {salesWithProductNames.slice().reverse().map((sale, index) => {
                    const saleDate = new Date(sale.sale_date); // Convert to Date object
                    const options = { year: 'numeric', month: 'long', day: 'numeric' }; // Define formatting options
                    const formattedDate = saleDate.toLocaleDateString(undefined, options); // Format date

                    const isLatest = latestIndex === salesWithProductNames.length - 1 - index; // Check if this is the latest sale

                    return (
                        <li
                            key={sale.id}
                            className={`bg-white p-4 rounded shadow-md ${isLatest ? 'border-2 border-blue-500' : ''}`} // Highlight latest sale
                        >
                            <div>Product Name: {sale.product_name}</div> {/* Show product name */}
                            <div>Quantity Sold: {sale.quantity_sold}</div>
                            <div>Customer: {sale.customer_name}</div>
                            <div>Sold on: {formattedDate}</div> {/* Display formatted date */}
                            <div>Total Amount: {sale.total_amount}</div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default SalesList;
