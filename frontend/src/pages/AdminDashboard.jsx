import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/Header';

const validate = (fields) => {
    const errors = {};
    if (fields.name !== undefined && (fields.name.length < 20 || fields.name.length > 60))
        errors.name = 'Name must be 20–60 characters.';
    if (fields.address !== undefined && fields.address.length > 400)
        errors.address = 'Address must be under 400 characters.';
    if (fields.password !== undefined) {
        const pw = fields.password;
        if (pw.length < 8 || pw.length > 16) errors.password = 'Password must be 8–16 characters.';
        else if (!/[A-Z]/.test(pw)) errors.password = 'Must contain at least one uppercase letter.';
        else if (!/[^a-zA-Z0-9]/.test(pw)) errors.password = 'Must contain at least one special character.';
    }
    return errors;
};

const SortableHeader = ({ label, field, sort, onSort }) => {
    const active = sort.field === field;
    return (
        <th className={`sortable ${active ? (sort.dir === 'asc' ? 'sort-asc' : 'sort-desc') : ''}`}
            onClick={() => onSort(field)}>
            {label}
            <span className="sort-icon">{active ? (sort.dir === 'asc' ? '↑' : '↓') : '↕'}</span>
        </th>
    );
};

const RoleBadge = ({ role }) => {
    const cls = role?.toUpperCase() === 'ADMIN' ? 'badge-admin' : role?.toUpperCase() === 'STORE_OWNER' ? 'badge-store' : 'badge-user';
    const label = role?.toUpperCase() === 'STORE_OWNER' ? 'Store Owner' : role;
    return <span className={`badge ${cls}`}>{label}</span>;
};

const AddUserModal = ({ onClose, onSuccess, api }) => {
    const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'USER' });
    const [fieldErrors, setFieldErrors] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (field, val) => {
        setForm(f => ({ ...f, [field]: val }));
        const errs = validate({ [field]: val });
        setFieldErrors(e => ({ ...e, [field]: errs[field] || null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate(form);
        if (Object.keys(errs).length) { setFieldErrors(errs); return; }
        setLoading(true); setError('');
        try {
            await api.post('/api/users', form);
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal-card">
                <div className="modal-header">
                    <span className="modal-title">Add New User</span>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" placeholder="20–60 characters" value={form.name}
                            onChange={e => handleChange('name', e.target.value)} required disabled={loading} />
                        {fieldErrors.name && <div className="form-hint" style={{color:'var(--error)'}}>{fieldErrors.name}</div>}
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="user@example.com" value={form.email}
                            onChange={e => handleChange('email', e.target.value)} required disabled={loading} />
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <textarea placeholder="Max 400 characters" value={form.address}
                            onChange={e => handleChange('address', e.target.value)} required disabled={loading} maxLength={400} />
                        {fieldErrors.address && <div className="form-hint" style={{color:'var(--error)'}}>{fieldErrors.address}</div>}
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="8–16 chars, 1 uppercase, 1 special" value={form.password}
                            onChange={e => handleChange('password', e.target.value)} required disabled={loading} />
                        {fieldErrors.password && <div className="form-hint" style={{color:'var(--error)'}}>{fieldErrors.password}</div>}
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <select value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value}))} disabled={loading}>
                            <option value="USER">Normal User</option>
                            <option value="ADMIN">Administrator</option>
                            <option value="STORE_OWNER">Store Owner</option>
                        </select>
                    </div>
                    {error && <div className="error-message">⚠ {error}</div>}
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={loading} style={{width:'auto'}}>
                            {loading ? 'Creating…' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AddStoreModal = ({ onClose, onSuccess, api }) => {
    const [form, setForm] = useState({ name: '', email: '', address: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            await api.post('/api/stores', form);
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create store.');
        } finally { setLoading(false); }
    };

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal-card">
                <div className="modal-header">
                    <span className="modal-title">Add New Store</span>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Store Name</label>
                        <input type="text" placeholder="20–60 characters" value={form.name}
                            onChange={e => setForm(f => ({...f, name: e.target.value}))} required disabled={loading} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={form.email}
                            onChange={e => setForm(f => ({...f, email: e.target.value}))} required disabled={loading} />
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <textarea placeholder="Max 400 characters" value={form.address}
                            onChange={e => setForm(f => ({...f, address: e.target.value}))} required disabled={loading} maxLength={400} />
                    </div>
                    {error && <div className="error-message">⚠ {error}</div>}
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={loading} style={{width:'auto'}}>
                            {loading ? 'Creating…' : 'Create Store'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const StarRating = ({ value }) => {
    const v = parseFloat(value) || 0;
    return (
        <span className="stars">
            {[1,2,3,4,5].map(i => (
                <span key={i} className={`star ${i <= Math.round(v) ? 'filled' : ''}`}>★</span>
            ))}
            <span style={{marginLeft:'0.35rem', fontSize:'0.85rem', color:'var(--text-2)'}}>{v > 0 ? v.toFixed(1) : 'N/A'}</span>
        </span>
    );
};

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddUser, setShowAddUser] = useState(false);
    const [showAddStore, setShowAddStore] = useState(false);
    const [userFilter, setUserFilter] = useState('');
    const [storeFilter, setStoreFilter] = useState('');
    const [userSort, setUserSort] = useState({ field: 'name', dir: 'asc' });
    const [storeSort, setStoreSort] = useState({ field: 'name', dir: 'asc' });
    const [roleFilter, setRoleFilter] = useState('ALL');
    const { api } = useAuth();

    const fetchData = useCallback(async () => {
        setLoading(true); setError('');
        try {
            const [statsRes, usersRes, storesRes] = await Promise.all([
                api.get('/api/stores/dashboard-stats'),
                api.get('/api/users'),
                api.get('/api/stores')
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setStores(storesRes.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch dashboard data.');
        } finally { setLoading(false); }
    }, [api]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSort = (table, field) => {
        if (table === 'user') {
            setUserSort(s => ({ field, dir: s.field === field && s.dir === 'asc' ? 'desc' : 'asc' }));
        } else {
            setStoreSort(s => ({ field, dir: s.field === field && s.dir === 'asc' ? 'desc' : 'asc' }));
        }
    };

    const filteredUsers = useMemo(() => {
        const q = userFilter.toLowerCase();
        return users
            .filter(u => {
                const matchQ = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.address?.toLowerCase().includes(q) || u.role?.toLowerCase().includes(q);
                const matchRole = roleFilter === 'ALL' || u.role?.toUpperCase() === roleFilter;
                return matchQ && matchRole;
            })
            .sort((a, b) => {
                const dir = userSort.dir === 'asc' ? 1 : -1;
                return (a[userSort.field] || '').toString().localeCompare((b[userSort.field] || '').toString()) * dir;
            });
    }, [users, userFilter, userSort, roleFilter]);

    const filteredStores = useMemo(() => {
        const q = storeFilter.toLowerCase();
        return stores
            .filter(s => !q || s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q) || s.address?.toLowerCase().includes(q))
            .sort((a, b) => {
                const dir = storeSort.dir === 'asc' ? 1 : -1;
                const av = a[storeSort.field] || '';
                const bv = b[storeSort.field] || '';
                return av.toString().localeCompare(bv.toString()) * dir;
            });
    }, [stores, storeFilter, storeSort]);

    if (loading) return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content" style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div style={{color:'var(--text-2)'}}>Loading dashboard…</div>
            </div>
        </div>
    );

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <div className="page-header">
                    <h1 className="page-title">Admin Dashboard</h1>
                    <p className="page-subtitle">Manage users, stores, and platform statistics</p>
                </div>

                <div className="page-body">
                    {error && <div className="error-message" style={{marginBottom:'1.5rem'}}>⚠ {error}</div>}

                    {/* Stats */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">👥</div>
                            <div className="stat-label">Total Users</div>
                            <div className="stat-value">{stats.totalUsers}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🏪</div>
                            <div className="stat-label">Total Stores</div>
                            <div className="stat-value">{stats.totalStores}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">⭐</div>
                            <div className="stat-label">Total Ratings</div>
                            <div className="stat-value">{stats.totalRatings}</div>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="section-header">
                        <span className="section-title">Users</span>
                        <button className="btn-primary btn-sm" style={{width:'auto'}} onClick={() => setShowAddUser(true)}>
                            + Add User
                        </button>
                    </div>

                    <div className="filter-bar">
                        <div className="search-input-wrapper">
                            <span className="search-icon">🔍</span>
                            <input placeholder="Search by name, email, address, role…"
                                value={userFilter} onChange={e => setUserFilter(e.target.value)} />
                        </div>
                        <select className="filter-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                            <option value="ALL">All Roles</option>
                            <option value="ADMIN">Admin</option>
                            <option value="USER">User</option>
                            <option value="STORE_OWNER">Store Owner</option>
                        </select>
                    </div>

                    <div className="table-wrapper" style={{marginBottom:'2.5rem'}}>
                        <table>
                            <thead>
                                <tr>
                                    <SortableHeader label="Name" field="name" sort={userSort} onSort={f => handleSort('user', f)} />
                                    <SortableHeader label="Email" field="email" sort={userSort} onSort={f => handleSort('user', f)} />
                                    <SortableHeader label="Address" field="address" sort={userSort} onSort={f => handleSort('user', f)} />
                                    <SortableHeader label="Role" field="role" sort={userSort} onSort={f => handleSort('user', f)} />
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr><td colSpan="4"><div className="empty-state"><div className="empty-state-icon">👤</div><p>No users found</p></div></td></tr>
                                ) : filteredUsers.map(u => (
                                    <tr key={u.id}>
                                        <td style={{color:'var(--text)', fontWeight:'500'}}>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td style={{maxWidth:'200px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{u.address}</td>
                                        <td><RoleBadge role={u.role} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Stores Table */}
                    <div className="section-header">
                        <span className="section-title">Stores</span>
                        <button className="btn-primary btn-sm" style={{width:'auto'}} onClick={() => setShowAddStore(true)}>
                            + Add Store
                        </button>
                    </div>

                    <div className="filter-bar">
                        <div className="search-input-wrapper">
                            <span className="search-icon">🔍</span>
                            <input placeholder="Search by name, email, address…"
                                value={storeFilter} onChange={e => setStoreFilter(e.target.value)} />
                        </div>
                    </div>

                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <SortableHeader label="Name" field="name" sort={storeSort} onSort={f => handleSort('store', f)} />
                                    <SortableHeader label="Email" field="email" sort={storeSort} onSort={f => handleSort('store', f)} />
                                    <SortableHeader label="Address" field="address" sort={storeSort} onSort={f => handleSort('store', f)} />
                                    <SortableHeader label="Rating" field="overallRating" sort={storeSort} onSort={f => handleSort('store', f)} />
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStores.length === 0 ? (
                                    <tr><td colSpan="4"><div className="empty-state"><div className="empty-state-icon">🏪</div><p>No stores found</p></div></td></tr>
                                ) : filteredStores.map(s => (
                                    <tr key={s.id}>
                                        <td style={{color:'var(--text)', fontWeight:'500'}}>{s.name}</td>
                                        <td>{s.email}</td>
                                        <td style={{maxWidth:'200px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{s.address}</td>
                                        <td><StarRating value={s.overallRating} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showAddUser && <AddUserModal api={api} onClose={() => setShowAddUser(false)} onSuccess={() => { setShowAddUser(false); fetchData(); }} />}
            {showAddStore && <AddStoreModal api={api} onClose={() => setShowAddStore(false)} onSuccess={() => { setShowAddStore(false); fetchData(); }} />}
        </div>
    );
};

export default AdminDashboard;