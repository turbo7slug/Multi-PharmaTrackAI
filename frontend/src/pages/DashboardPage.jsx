import React, { useEffect, useState } from 'react';
import { getSales, getPendingOrderCount, getStockAlerts, getYearlyRevenue } from '../api/analyticsApi';
import MonthlySalesChart from './MonthlySalesChart';
import Chatbot from './Chatbot';  // Import the Chatbot

const DashboardPage = () => {
    const [totalSales, setTotalSales] = useState(0);
    const [pendingOrders, setPendingOrders] = useState(0);
    const [lowStockAlerts, setLowStockAlerts] = useState(0);
    const [revenue, setRevenue] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const year = 2023;
                const salesData = await getSales(year);
                setTotalSales(salesData.totalRevenue);

                const pendingOrdersData = await getPendingOrderCount();
                setPendingOrders(pendingOrdersData.pendingOrderCount);

                const stockAlertsData = await getStockAlerts();
                setLowStockAlerts(stockAlertsData.length);

                const revenueData = await getYearlyRevenue('2023-01-01', '2023-12-31');
                setRevenue(revenueData.total_revenue || 0);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 hover:bg-blue-100 p-6 rounded-lg shadow-md transition duration-300">
                    <h2 className="text-xl font-semibold">Total Sales (Yearly)</h2>
                    <p className="text-2xl mt-2">₹ {totalSales}</p>
                </div>
                <div className="bg-green-50 hover:bg-green-100 p-6 rounded-lg shadow-md transition duration-300">
                    <h2 className="text-xl font-semibold">Pending Orders</h2>
                    <p className="text-2xl mt-2">{pendingOrders}</p>
                </div>
                <div className="bg-yellow-50 hover:bg-yellow-100 p-6 rounded-lg shadow-md transition duration-300">
                    <h2 className="text-xl font-semibold">Low Stock Alerts</h2>
                    <p className="text-2xl mt-2">{lowStockAlerts}</p>
                </div>
            </div>

            {/* Monthly Sales Chart */}
            <MonthlySalesChart year={2023} />

            {/* Chatbot */}
            <Chatbot />
        </div>
    );
};

export default DashboardPage;
