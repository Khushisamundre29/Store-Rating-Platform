import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const roleNavItems = {
    ADMIN: [
        { icon: '⬛', label: 'Dashboard', path: '/admin' },
        { icon: '👥', label: 'Users', path: '/admin/users' },
        { icon: '🏪', label: 'Stores', path: '/admin/stores' },
    ],
    USER: [
        { icon: '🏪', label: 'Browse Stores', path: '/user' },
        { icon: '🔑', label: 'Change Password', path: '/user/password' },
    ],
    STORE_OWNER: [
        { icon: '⬛', label: 'My Store', path: '/store-owner' },
        { icon: '🔑', label: 'Change Password', path: '/store-owner/password' },
    ],
};

const Sidebar = ({ activeSection, onNavigate }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const role = user?.role?.toUpperCase() || 'USER';
    const navItems = roleNavItems[role] || roleNavItems.USER;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
        : '?';

    const roleLabel = role === 'STORE_OWNER' ? 'Store Owner' : role.charAt(0) + role.slice(1).toLowerCase();

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="sidebar-brand-icon">⭐</div>
                <span className="sidebar-brand-name">RateStore</span>
            </div>

            <nav className="sidebar-nav">
                <div className="sidebar-section-label">Navigation</div>
                {navItems.map(item => (
                    <button
                        key={item.path}
                        className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="sidebar-avatar">{initials}</div>
                    <div className="sidebar-user-info">
                        <div className="sidebar-user-name">{user?.name || 'User'}</div>
                        <div className="sidebar-user-role">{roleLabel}</div>
                    </div>
                </div>
                <button className="sidebar-nav-item" onClick={handleLogout} style={{color:'var(--error)'}}>
                    <span className="nav-icon">↩</span>
                    Sign out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
