import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MonthlySalesChart = ({ year }) => {
    const [monthlySalesData, setMonthlySalesData] = useState([]);
    const [demandData, setDemandData] = useState([]); // State for demand data
    const API_URL = 'http://localhost:5000/api/v1/analytics';

    useEffect(() => {
        const fetchMonthlySales = async () => {
            try {
                const response = await axios.get(`${API_URL}/sales-by-year/${year}`);
                const salesData = response.data.monthlySalesBreakdown.map((revenue, index) => ({
                    month: index + 1,
                    monthly_revenue: revenue,
                }));
                // Filter to show only the first 4 months
                const filteredSalesData = salesData.filter(data => data.month <= 4);
                setMonthlySalesData(filteredSalesData);
            } catch (error) {
                console.error('Error fetching monthly sales data:', error);
            }
        };

        const fetchDemandData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/predict/demand');
                console.log('API Response:', response.data); // Log the response for debugging

                const demandResponse = Object.entries(response.data).map(([productName, { demand }]) => ({
                    productName,
                    demand,
                }));

                setDemandData(demandResponse);
            } catch (error) {
                console.error('Error fetching demand data:', error);
            }
        };

        fetchMonthlySales();
        fetchDemandData(); // Fetch demand data
    }, [year]);

    return (
        <div className="flex flex-wrap justify-between mt-3 ">
            <div className="flex-1 min-w-0 p-2 bg-white shadow rounded-lg mx-3">
                <h2 className="text-xl font-semibold mb-4">Monthly Sales</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={monthlySalesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="monthly_revenue" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="flex-1 min-w-0 p-2 bg-white shadow rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Predicted Demands (Weekly) </h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={demandData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="productName" tick={false}/>
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="demand" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MonthlySalesChart;
