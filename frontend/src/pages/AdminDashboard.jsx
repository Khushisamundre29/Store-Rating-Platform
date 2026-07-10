import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useDebouncedValue } from '../hooks/useDebounce';
import Sidebar from '../components/layout/Sidebar';
import {
    IconSearch, IconUsers, IconStorefront, IconStar, IconAlert,
    IconChevronUp, IconChevronDown, IconChevronUpDown,
    IconEdit, IconTrash, IconClose, IconPlus,
} from '../components/icons/Icons';

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
            <span className="sort-icon">
                {active ? (sort.dir === 'asc' ? <IconChevronUp /> : <IconChevronDown />) : <IconChevronUpDown />}
            </span>
        </th>
    );
};

const RoleBadge = ({ role }) => {
    const upper = role?.toUpperCase();
    const cls = upper === 'ADMIN' ? 'badge-admin' : upper === 'STORE_OWNER' ? 'badge-store' : 'badge-user';
    const label = upper === 'STORE_OWNER' ? 'Store Owner' : role;
    return <span className={`badge ${cls}`}>{label}</span>;
};

const SkeletonRows = ({ cols, rows = 5 }) => (
    <>
        {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
                {Array.from({ length: cols }).map((__, c) => (
                    <td key={c}><div className="skeleton" style={{ height: '14px', width: c === 0 ? '70%' : '85%' }} /></td>
                ))}
            </tr>
        ))}
    </>
);

// ---------- User create/edit modal ----------

const UserModal = ({ onClose, onSuccess, api, editingUser }) => {
    const isEdit = Boolean(editingUser);
    const [form, setForm] = useState(
        isEdit
            ? { name: editingUser.name, email: editingUser.email, address: editingUser.address, role: editingUser.role?.toUpperCase() || 'USER', password: '' }
            : { name: '', email: '', address: '', password: '', role: 'USER' }
    );
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
        const toValidate = isEdit
            ? { name: form.name, address: form.address }
            : { name: form.name, address: form.address, password: form.password };
        const errs = validate(toValidate);
        if (Object.keys(errs).length) { setFieldErrors(errs); return; }

        setLoading(true); setError('');
        try {
            if (isEdit) {
                await api.put(`/api/users/${editingUser.id}`, {
                    name: form.name, email: form.email, address: form.address, role: form.role,
                });
            } else {
                await api.post('/api/users', form);
            }
            onSuccess(isEdit ? 'User updated.' : 'User created.');
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} user.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal-card">
                <div className="modal-header">
                    <span className="modal-title">{isEdit ? 'Edit User' : 'Add New User'}</span>
                    <button className="modal-close" onClick={onClose}><IconClose width={16} height={16} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" placeholder="20–60 characters" value={form.name}
                            onChange={e => handleChange('name', e.target.value)} required disabled={loading} />
                        {fieldErrors.name && <div className="form-hint" style={{ color: 'var(--error)' }}>{fieldErrors.name}</div>}
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
                        {fieldErrors.address && <div className="form-hint" style={{ color: 'var(--error)' }}>{fieldErrors.address}</div>}
                    </div>
                    {!isEdit && (
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" placeholder="8–16 chars, 1 uppercase, 1 special" value={form.password}
                                onChange={e => handleChange('password', e.target.value)} required disabled={loading} />
                            {fieldErrors.password && <div className="form-hint" style={{ color: 'var(--error)' }}>{fieldErrors.password}</div>}
                        </div>
                    )}
                    <div className="form-group">
                        <label>Role</label>
                        <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} disabled={loading}>
                            <option value="USER">Normal User</option>
                            <option value="ADMIN">Administrator</option>
                            <option value="STORE_OWNER">Store Owner</option>
                        </select>
                    </div>
                    {error && <div className="error-message"><IconAlert width={16} height={16} />{error}</div>}
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={loading} style={{ width: 'auto' }}>
                            {loading ? (isEdit ? 'Saving…' : 'Creating…') : (isEdit ? 'Save Changes' : 'Create User')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ---------- Store create/edit modal ----------

const StoreModal = ({ onClose, onSuccess, api, editingStore }) => {
    const isEdit = Boolean(editingStore);
    const [form, setForm] = useState(
        isEdit
            ? { name: editingStore.name, email: editingStore.email, address: editingStore.address }
            : { name: '', email: '', address: '' }
    );
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            if (isEdit) {
                await api.put(`/api/stores/${editingStore.id}`, form);
            } else {
                await api.post('/api/stores', form);
            }
            onSuccess(isEdit ? 'Store updated.' : 'Store created.');
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} store.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal-card">
                <div className="modal-header">
                    <span className="modal-title">{isEdit ? 'Edit Store' : 'Add New Store'}</span>
                    <button className="modal-close" onClick={onClose}><IconClose width={16} height={16} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Store Name</label>
                        <input type="text" placeholder="20–60 characters" value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required disabled={loading} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={form.email}
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required disabled={loading} />
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <textarea placeholder="Max 400 characters" value={form.address}
                            onChange={e => setForm(f => ({ ...f, address: e.target.value }))} required disabled={loading} maxLength={400} />
                    </div>
                    {error && <div className="error-message"><IconAlert width={16} height={16} />{error}</div>}
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={loading} style={{ width: 'auto' }}>
                            {loading ? (isEdit ? 'Saving…' : 'Creating…') : (isEdit ? 'Save Changes' : 'Create Store')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ConfirmDeleteModal = ({ title, message, onCancel, onConfirm, loading }) => (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
        <div className="modal-card" style={{ maxWidth: '380px' }}>
            <div className="modal-header">
                <span className="modal-title">{title}</span>
                <button className="modal-close" onClick={onCancel}><IconClose width={16} height={16} /></button>
            </div>
            <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', margin: '0 0 1.5rem' }}>{message}</p>
            <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
                <button type="button" className="btn-danger" onClick={onConfirm} disabled={loading} style={{ width: 'auto' }}>
                    {loading ? 'Deleting…' : 'Delete'}
                </button>
            </div>
        </div>
    </div>
);

const StarRating = ({ value }) => {
    const v = parseFloat(value) || 0;
    return (
        <span className="stars">
            {[1, 2, 3, 4, 5].map(i => (
                <span key={i} className={`star ${i <= Math.round(v) ? 'filled' : ''}`}>
                    <IconStar filled={i <= Math.round(v)} width={13} height={13} />
                </span>
            ))}
            <span style={{ marginLeft: '0.35rem', fontSize: '0.85rem', color: 'var(--text-2)' }}>{v > 0 ? v.toFixed(1) : 'N/A'}</span>
        </span>
    );
};

// ---------- Dashboard (stats-only) view ----------

const StatsView = ({ stats, error }) => (
    <>
        <div className="page-header">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Platform overview at a glance</p>
        </div>
        <div className="page-body">
            {error && <div className="error-message" style={{ marginBottom: '1.5rem' }}><IconAlert width={16} height={16} />{error}</div>}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon"><IconUsers width={22} height={22} /></div>
                    <div className="stat-label">Total Users</div>
                    <div className="stat-value">{stats.totalUsers}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"><IconStorefront width={22} height={22} /></div>
                    <div className="stat-label">Total Stores</div>
                    <div className="stat-value">{stats.totalStores}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ color: 'var(--gold)' }}><IconStar filled width={22} height={22} /></div>
                    <div className="stat-label">Total Ratings</div>
                    <div className="stat-value">{stats.totalRatings}</div>
                </div>
            </div>
        </div>
    </>
);

// ---------- Users-only view ----------

const UsersView = ({ users, loading, error, api, refresh, toast }) => {
    const [filterInput, setFilterInput] = useState('');
    const filter = useDebouncedValue(filterInput, 300);
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [sort, setSort] = useState({ field: 'name', dir: 'asc' });
    const [showAdd, setShowAdd] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleSort = (field) => setSort(s => ({ field, dir: s.field === field && s.dir === 'asc' ? 'desc' : 'asc' }));

    const filtered = useMemo(() => {
        const q = filter.toLowerCase();
        return users
            .filter(u => {
                const matchQ = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.address?.toLowerCase().includes(q);
                const matchRole = roleFilter === 'ALL' || u.role?.toUpperCase() === roleFilter;
                return matchQ && matchRole;
            })
            .sort((a, b) => {
                const dir = sort.dir === 'asc' ? 1 : -1;
                return (a[sort.field] || '').toString().localeCompare((b[sort.field] || '').toString()) * dir;
            });
    }, [users, filter, roleFilter, sort]);

    const clearFilters = () => { setFilterInput(''); setRoleFilter('ALL'); };
    const hasActiveFilter = filterInput !== '' || roleFilter !== 'ALL';

    const handleModalSuccess = (message) => {
        setShowAdd(false); setEditing(null);
        toast.success(message);
        refresh();
    };

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            await api.delete(`/api/users/${deleting.id}`);
            toast.success('User deleted.');
            setDeleting(null);
            refresh();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete user.');
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">Users</h1>
                <p className="page-subtitle">Manage every account on the platform</p>
            </div>
            <div className="page-body">
                {error && <div className="error-message" style={{ marginBottom: '1.5rem' }}><IconAlert width={16} height={16} />{error}</div>}

                <div className="section-header">
                    <span className="section-title">All Users</span>
                    <button className="btn-primary btn-sm" style={{ width: 'auto' }} onClick={() => setShowAdd(true)}>
                        <IconPlus width={16} height={16} /> Add User
                    </button>
                </div>

                <div className="filter-bar">
                    <div className="search-input-wrapper">
                        <span className="search-icon"><IconSearch width={16} height={16} /></span>
                        <input placeholder="Search by name, email, address…" value={filterInput} onChange={e => setFilterInput(e.target.value)} />
                    </div>
                    <select className="filter-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                        <option value="ALL">All Roles</option>
                        <option value="ADMIN">Admin</option>
                        <option value="USER">User</option>
                        <option value="STORE_OWNER">Store Owner</option>
                    </select>
                </div>

                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <SortableHeader label="Name" field="name" sort={sort} onSort={handleSort} />
                                <SortableHeader label="Email" field="email" sort={sort} onSort={handleSort} />
                                <SortableHeader label="Address" field="address" sort={sort} onSort={handleSort} />
                                <SortableHeader label="Role" field="role" sort={sort} onSort={handleSort} />
                                <th style={{ width: '90px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <SkeletonRows cols={5} />
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="5">
                                        <div className="empty-state">
                                            <div className="empty-state-icon"><IconUsers /></div>
                                            <p>No users found</p>
                                            {hasActiveFilter && (
                                                <button className="btn-link" onClick={clearFilters}>Clear filters</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.map(u => (
                                <tr key={u.id}>
                                    <td style={{ color: 'var(--text)', fontWeight: '500' }}>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.address}</td>
                                    <td><RoleBadge role={u.role} /></td>
                                    <td>
                                        <div className="row-actions">
                                            <button className="icon-btn" title="Edit" onClick={() => setEditing(u)}><IconEdit width={15} height={15} /></button>
                                            <button className="icon-btn icon-btn-danger" title="Delete" onClick={() => setDeleting(u)}><IconTrash width={15} height={15} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAdd && <UserModal api={api} onClose={() => setShowAdd(false)} onSuccess={handleModalSuccess} />}
            {editing && <UserModal api={api} editingUser={editing} onClose={() => setEditing(null)} onSuccess={handleModalSuccess} />}
            {deleting && (
                <ConfirmDeleteModal
                    title="Delete user"
                    message={`Delete ${deleting.name}? This also removes their submitted ratings. This cannot be undone.`}
                    onCancel={() => setDeleting(null)}
                    onConfirm={handleDelete}
                    loading={deleteLoading}
                />
            )}
        </>
    );
};

// ---------- Stores-only view ----------

const StoresView = ({ stores, loading, error, api, refresh, toast }) => {
    const [filterInput, setFilterInput] = useState('');
    const filter = useDebouncedValue(filterInput, 300);
    const [sort, setSort] = useState({ field: 'name', dir: 'asc' });
    const [showAdd, setShowAdd] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleSort = (field) => setSort(s => ({ field, dir: s.field === field && s.dir === 'asc' ? 'desc' : 'asc' }));

    const filtered = useMemo(() => {
        const q = filter.toLowerCase();
        return stores
            .filter(s => !q || s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q) || s.address?.toLowerCase().includes(q))
            .sort((a, b) => {
                const dir = sort.dir === 'asc' ? 1 : -1;
                return (a[sort.field] || '').toString().localeCompare((b[sort.field] || '').toString()) * dir;
            });
    }, [stores, filter, sort]);

    const handleModalSuccess = (message) => {
        setShowAdd(false); setEditing(null);
        toast.success(message);
        refresh();
    };

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            await api.delete(`/api/stores/${deleting.id}`);
            toast.success('Store deleted.');
            setDeleting(null);
            refresh();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete store.');
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">Stores</h1>
                <p className="page-subtitle">Manage every store on the platform</p>
            </div>
            <div className="page-body">
                {error && <div className="error-message" style={{ marginBottom: '1.5rem' }}><IconAlert width={16} height={16} />{error}</div>}

                <div className="section-header">
                    <span className="section-title">All Stores</span>
                    <button className="btn-primary btn-sm" style={{ width: 'auto' }} onClick={() => setShowAdd(true)}>
                        <IconPlus width={16} height={16} /> Add Store
                    </button>
                </div>

                <div className="filter-bar">
                    <div className="search-input-wrapper">
                        <span className="search-icon"><IconSearch width={16} height={16} /></span>
                        <input placeholder="Search by name, email, address…" value={filterInput} onChange={e => setFilterInput(e.target.value)} />
                    </div>
                </div>

                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <SortableHeader label="Name" field="name" sort={sort} onSort={handleSort} />
                                <SortableHeader label="Email" field="email" sort={sort} onSort={handleSort} />
                                <SortableHeader label="Address" field="address" sort={sort} onSort={handleSort} />
                                <SortableHeader label="Rating" field="overallRating" sort={sort} onSort={handleSort} />
                                <th style={{ width: '90px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <SkeletonRows cols={5} />
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="5">
                                        <div className="empty-state">
                                            <div className="empty-state-icon"><IconStorefront /></div>
                                            <p>No stores found</p>
                                            {filterInput && <button className="btn-link" onClick={() => setFilterInput('')}>Clear search</button>}
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.map(s => (
                                <tr key={s.id}>
                                    <td style={{ color: 'var(--text)', fontWeight: '500' }}>{s.name}</td>
                                    <td>{s.email}</td>
                                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.address}</td>
                                    <td><StarRating value={s.overallRating} /></td>
                                    <td>
                                        <div className="row-actions">
                                            <button className="icon-btn" title="Edit" onClick={() => setEditing(s)}><IconEdit width={15} height={15} /></button>
                                            <button className="icon-btn icon-btn-danger" title="Delete" onClick={() => setDeleting(s)}><IconTrash width={15} height={15} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAdd && <StoreModal api={api} onClose={() => setShowAdd(false)} onSuccess={handleModalSuccess} />}
            {editing && <StoreModal api={api} editingStore={editing} onClose={() => setEditing(null)} onSuccess={handleModalSuccess} />}
            {deleting && (
                <ConfirmDeleteModal
                    title="Delete store"
                    message={`Delete ${deleting.name}? This also removes all of its ratings. This cannot be undone.`}
                    onCancel={() => setDeleting(null)}
                    onConfirm={handleDelete}
                    loading={deleteLoading}
                />
            )}
        </>
    );
};

// ---------- Root component: decides which view based on the URL ----------

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { api } = useAuth();
    const toast = useToast();

    const fetchData = useCallback(async () => {
        setLoading(true); setError('');
        try {
            const [statsRes, usersRes, storesRes] = await Promise.all([
                api.get('/api/stores/dashboard-stats'),
                api.get('/api/users'),
                api.get('/api/stores'),
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setStores(storesRes.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch dashboard data.');
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const path = typeof window !== 'undefined' ? window.location.pathname : '/admin';
    const view = path.includes('/admin/users') ? 'users' : path.includes('/admin/stores') ? 'stores' : 'dashboard';

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                {view === 'dashboard' && <StatsView stats={stats} error={error} />}
                {view === 'users' && <UsersView users={users} loading={loading} error={error} api={api} refresh={fetchData} toast={toast} />}
                {view === 'stores' && <StoresView stores={stores} loading={loading} error={error} api={api} refresh={fetchData} toast={toast} />}
            </div>
        </div>
    );
};

export default AdminDashboard;