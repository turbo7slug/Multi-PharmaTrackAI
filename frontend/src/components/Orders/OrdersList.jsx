import React, { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../../api/ordersApi';
import OrderItem from './OrderItem';
import { getProductByID } from '../../api/productApi'; // Import the function to get product details

const OrdersList = () => {
    const [ordersWithProductNames, setOrdersWithProductNames] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch orders and product names
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getAllOrders();
                const ordersData = response.data;

                // For each order, fetch the corresponding product name by product_id
                const ordersWithNames = await Promise.all(
                    ordersData.map(async (order) => {
                        try {
                            const productResponse = await getProductByID(order.product_id);
                            const product = productResponse.data;
                            return { ...order, product_name: product.product_name };
                        } catch (error) {
                            console.error('Error fetching product name:', error);
                            return { ...order, product_name: 'Unknown' };
                        }
                    })
                );

                setOrdersWithProductNames(ordersWithNames);
                setLoading(false);
            } catch (error) {
                setError('Error fetching orders. Please try again later.');
                setLoading(false);
            }
        };

        fetchOrders();
    }, []); // Run only once when the component mounts

    // Function to update the order status
    const handleUpdateOrderStatus = async (orderId, updatedData) => {
        try {
            // Optimistically update state by updating the relevant order in the list
            setOrdersWithProductNames((prevOrders) =>
                prevOrders.map((order) =>
                    order.order_id === orderId
                        ? { ...order, ...updatedData, actual_delivery_date: updatedData.actual_delivery_date || order.actual_delivery_date }
                        : order
                )
            );

            // Update on the server
            await updateOrderStatus(orderId, updatedData);
        } catch (error) {
            setError('Error updating order status. Please try again later.');
        }
    };

    if (loading) return <div>Loading orders...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    // Get the index of the latest entry in the orders list
    const latestIndex = ordersWithProductNames.length - 1;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Orders List</h2>
            <ul className="space-y-4">
                {ordersWithProductNames.map((order, index) => (
                    <OrderItem
                        key={order.order_id}
                        order={order}
                        onUpdateStatus={handleUpdateOrderStatus}
                        isLatest={latestIndex === ordersWithProductNames.length - 1 - index}
                    />
                ))}
            </ul>
        </div>
    );
};

export default OrdersList;
