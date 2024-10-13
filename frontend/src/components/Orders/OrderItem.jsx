import React, { useState, useEffect } from 'react';
import { getProductByID } from '../../api/productApi'; // Assuming the function is in ordersApi.js

const OrderItem = ({ order, onUpdateStatus, isLatest }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [status, setStatus] = useState(order.status);
    const [actualDeliveryDate, setActualDeliveryDate] = useState(order.actual_delivery_date || '');
    const [productName, setProductName] = useState(''); // State to hold the product name

    // Fetch the product name when the component mounts
    useEffect(() => {
        const fetchProductName = async () => {
            try {
                const response = await getProductByID(order.product_id);
                setProductName(response.data.product_name); // Assuming the product_name is in response.data
            } catch (error) {
                console.error('Error fetching product name:', error);
                setProductName('Unknown'); // Fallback if fetch fails
            }
        };

        fetchProductName(); // Trigger the product name fetch
    }, [order.product_id]);

    // Function to format the date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }; // Define formatting options
        return new Date(dateString).toLocaleDateString(undefined, options); // Format date
    };

    const handleSubmit = () => {
        const updatedData = {
            status,
            actual_delivery_date: status === 'delivered' ? actualDeliveryDate : null, // Send date only if status is delivered
        };

        onUpdateStatus(order.order_id, updatedData)
            .then(() => {
                setIsEditing(false); // Exit editing mode after successful update
            })
            .catch((err) => {
                console.error('Failed to update order status:', err);
            });
    };

    return (
        <li className={`bg-white p-4 rounded shadow-md ${isLatest ? 'border-2 border-blue-500' : ''}`}>
            <div>Product Name: {productName}</div> {/* Show the fetched product name */}
            <div>Order Date: {formatDate(order.order_date)}</div> {/* Format the order date */}
            <div>Total Cost: {order.total_cost}</div>
            <div>Quantity: {order.quantity}</div>
            <div>Actual Delivery Date: {formatDate(order.actual_delivery_date) || 'Not delivered yet'}</div>
            <div>Claimed Lead Time: {order.claimed_lead_time}</div>
            <div>Actual Lead Time: {order.actual_lead_time}</div>
            <div>Status: {order.status}</div>

            {isEditing ? (
                <div className="mt-4">
                    <div className="mb-2">
                        <label className="block">Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border p-2 w-full">
                            <option value="pending">Pending</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    {status === 'delivered' && (
                        <div className="mb-2">
                            <label className="block">Actual Delivery Date</label>
                            <input
                                type="date"
                                value={actualDeliveryDate}
                                onChange={(e) => setActualDeliveryDate(e.target.value)}
                                className="border p-2 w-full"
                                required
                            />
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white py-2 px-4 rounded mt-4"
                    >
                        Update Status
                    </button>

                    <button
                        onClick={() => setIsEditing(false)}
                        className="ml-4 bg-gray-600 text-white py-2 px-4 rounded mt-4"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setIsEditing(true)}
                    className="bg-green-600 text-white py-2 px-4 rounded mt-4"
                >
                    Edit Order
                </button>
            )}
        </li>
    );
};

export default OrderItem;


