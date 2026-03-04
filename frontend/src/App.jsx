import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, token, loading } = useAuth();
    if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-2)' }}>Loading…</div>;
    if (!token || !user) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role?.toUpperCase())) return <Navigate to="/dashboard" replace />;
    return children;
};

const DashboardRedirect = () => {
    const { user, loading } = useAuth();
    if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-2)' }}>Loading…</div>;
    if (!user) return <Navigate to="/login" replace />;
    const role = user.role?.toUpperCase();
    if (role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (role === 'USER') return <Navigate to="/user" replace />;
    if (role === 'STORE_OWNER') return <Navigate to="/store-owner" replace />;
    return <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-2)' }}>Loading…</div>;
    if (user) return <Navigate to="/dashboard" replace />;
    return children;
};

function App() {
    return (
        <Routes>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/stores" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/user" element={<ProtectedRoute allowedRoles={['USER']}><UserDashboard /></ProtectedRoute>} />
            <Route path="/user/password" element={<ProtectedRoute allowedRoles={['USER']}><UserDashboard /></ProtectedRoute>} />
            <Route path="/store-owner" element={<ProtectedRoute allowedRoles={['STORE_OWNER']}><StoreOwnerDashboard /></ProtectedRoute>} />
            <Route path="/store-owner/password" element={<ProtectedRoute allowedRoles={['STORE_OWNER']}><StoreOwnerDashboard /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;