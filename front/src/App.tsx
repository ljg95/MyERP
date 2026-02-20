import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import PartnerList from './pages/PartnerList';
import PartnerForm from './pages/PartnerForm';
import OrderHistory from './pages/OrderHistory';
import OrderForm from './pages/OrderForm';
import OrderDetail from './pages/OrderDetail';
import InventoryStatus from './pages/InventoryStatus';
import InventoryHistory from './pages/InventoryHistory';
import InventoryAdjustment from './pages/InventoryAdjustment';
import Login from './pages/Login';
import Register from './pages/Register';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id" element={<ProductForm />} />
          <Route path="partners" element={<PartnerList />} />
          <Route path="partners/new" element={<PartnerForm />} />
          <Route path="partners/:id" element={<PartnerForm />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route path="orders/new" element={<OrderForm />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="inventory" element={<InventoryStatus />} />
          <Route path="inventory/adjust/:id" element={<InventoryAdjustment />} />
          <Route path="inventory/history" element={<InventoryHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
