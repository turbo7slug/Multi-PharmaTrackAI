import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import SalesPage from './pages/SalesPage';
import InventoryPage from './pages/InventoryPage';

const App = () => {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <nav className="bg-blue-600 p-4 text-white">
          <ul className="flex space-x-4">
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/orders">Orders</Link></li>
            <li><Link to="/sales">Sales</Link></li>
            <li><Link to="/inventory">Inventory</Link></li>
          </ul>
        </nav>
        <main className="p-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
