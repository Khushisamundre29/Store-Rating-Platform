import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDebouncedValue } from '../hooks/useDebounce';
import Sidebar from '../components/layout/Sidebar';
import { IconSearch, IconStar, IconUsers, IconAlert, IconCheck, IconChevronUp, IconChevronDown, IconChevronUpDown } from '../components/icons/Icons';

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

const SkeletonRows = ({ cols, rows = 4 }) => (
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

const ChangePasswordSection = ({ api }) => {
    const [form, setForm] = useState({ current: '', newPw: '', confirm: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const validate = (pw) => {
        if (pw.length < 8 || pw.length > 16) return '8–16 characters required.';
        if (!/[A-Z]/.test(pw)) return 'Must include at least one uppercase letter.';
        if (!/[^a-zA-Z0-9]/.test(pw)) return 'Must include at least one special character.';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        const pwErr = validate(form.newPw);
        if (pwErr) { setError(pwErr); return; }
        if (form.newPw !== form.confirm) { setError('Passwords do not match.'); return; }
        setLoading(true);
        try {
            await api.put('/api/auth/password', { currentPassword: form.current, newPassword: form.newPw });
            setSuccess('Password updated successfully!');
            setForm({ current: '', newPw: '', confirm: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update password.');
        } finally { setLoading(false); }
    };

    return (
        <div className="password-section">
            <h3 style={{ marginBottom: '1.25rem', fontSize: '1.05rem' }}>Change Password</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Current Password</label>
                    <input type="password" value={form.current} onChange={e => setForm(f => ({ ...f, current: e.target.value }))} required disabled={loading} />
                </div>
                <div className="form-group">
                    <label>New Password</label>
                    <input type="password" placeholder="8–16 chars, 1 uppercase, 1 special" value={form.newPw} onChange={e => setForm(f => ({ ...f, newPw: e.target.value }))} required disabled={loading} />
                </div>
                <div className="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} required disabled={loading} />
                </div>
                {error && <div className="error-message"><IconAlert width={16} height={16} />{error}</div>}
                {success && <div className="success-message"><IconCheck width={16} height={16} />{success}</div>}
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Updating…' : 'Update Password'}
                </button>
            </form>
        </div>
    );
};

const StoreOwnerDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sort, setSort] = useState({ field: 'name', dir: 'asc' });
    const [searchInput, setSearchInput] = useState('');
    const search = useDebouncedValue(searchInput, 300);
    const { api } = useAuth();

    const fetchDashboardData = useCallback(async () => {
        setLoading(true); setError('');
        try {
            const response = await api.get('/api/stores/my-store');
            setDashboardData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch dashboard data.');
        } finally { setLoading(false); }
    }, [api]);

    useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

    const handleSort = (field) => {
        setSort(s => ({ field, dir: s.field === field && s.dir === 'asc' ? 'desc' : 'asc' }));
    };

    const filteredRaters = useMemo(() => {
        const q = search.toLowerCase();
        const raters = dashboardData?.raters || [];
        return raters
            .filter(r => !q || r.name?.toLowerCase().includes(q) || r.email?.toLowerCase().includes(q))
            .sort((a, b) => {
                const dir = sort.dir === 'asc' ? 1 : -1;
                return (a[sort.field] || '').toString().localeCompare((b[sort.field] || '').toString()) * dir;
            });
    }, [dashboardData?.raters, search, sort]);

    const location = typeof window !== 'undefined' ? window.location.pathname : '/store-owner';
    const isPassword = location.includes('password');

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                {isPassword ? (
                    <>
                        <div className="page-header">
                            <h1 className="page-title">Change Password</h1>
                            <p className="page-subtitle">Update your account password</p>
                        </div>
                        <div className="page-body">
                            <ChangePasswordSection api={api} />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="page-header">
                            <h1 className="page-title">My Store Dashboard</h1>
                            <p className="page-subtitle">View your store's performance and ratings</p>
                        </div>
                        <div className="page-body">
                            {error && <div className="error-message" style={{ marginBottom: '1.5rem' }}><IconAlert width={16} height={16} />{error}</div>}

                            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                                <div className="stat-card">
                                    <div className="stat-icon" style={{ color: 'var(--gold)' }}><IconStar filled width={22} height={22} /></div>
                                    <div className="stat-label">Average Rating</div>
                                    <div className="stat-value">
                                        {loading ? (
                                            <div className="skeleton" style={{ height: '28px', width: '50%' }} />
                                        ) : dashboardData?.averageRating ? (
                                            parseFloat(dashboardData.averageRating).toFixed(1)
                                        ) : '—'}
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon"><IconUsers width={22} height={22} /></div>
                                    <div className="stat-label">Total Raters</div>
                                    <div className="stat-value">
                                        {loading ? (
                                            <div className="skeleton" style={{ height: '28px', width: '30%' }} />
                                        ) : (
                                            dashboardData?.raters?.length || 0
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="section-header">
                                <span className="section-title">Users Who Rated Your Store</span>
                            </div>

                            <div className="filter-bar">
                                <div className="search-input-wrapper">
                                    <span className="search-icon"><IconSearch width={16} height={16} /></span>
                                    <input placeholder="Search by name or email…" value={searchInput} onChange={e => setSearchInput(e.target.value)} />
                                </div>
                            </div>

                            <div className="table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <SortableHeader label="User Name" field="name" sort={sort} onSort={handleSort} />
                                            <SortableHeader label="Email" field="email" sort={sort} onSort={handleSort} />
                                            <SortableHeader label="Rating" field="rating" sort={sort} onSort={handleSort} />
                                            <SortableHeader label="Date" field="updated_at" sort={sort} onSort={handleSort} />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <SkeletonRows cols={4} />
                                        ) : filteredRaters.length === 0 ? (
                                            <tr>
                                                <td colSpan="4">
                                                    <div className="empty-state">
                                                        <div className="empty-state-icon"><IconStar /></div>
                                                        <p>No ratings submitted yet.</p>
                                                        {searchInput && <button className="btn-link" onClick={() => setSearchInput('')}>Clear search</button>}
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : filteredRaters.map((rater, i) => (
                                            <tr key={i}>
                                                <td style={{ color: 'var(--text)', fontWeight: '500' }}>{rater.name}</td>
                                                <td>{rater.email}</td>
                                                <td>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                        <span className="stars">
                                                            {[1, 2, 3, 4, 5].map(n => (
                                                                <span key={n} className={`star ${n <= rater.rating ? 'filled' : ''}`}>
                                                                    <IconStar filled={n <= rater.rating} width={14} height={14} />
                                                                </span>
                                                            ))}
                                                        </span>
                                                        <span style={{ color: 'var(--text-2)', fontSize: '0.85rem' }}>{rater.rating}/5</span>
                                                    </span>
                                                </td>
                                                <td>{new Date(rater.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StoreOwnerDashboard;