import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useDebouncedValue } from '../hooks/useDebounce';
import Sidebar from '../components/layout/Sidebar';
import { IconSearch, IconStar, IconAlert, IconCheck, IconStorefront } from '../components/icons/Icons';

const StarRating = ({ value }) => {
    const v = parseFloat(value) || 0;
    return (
        <span className="stars">
            {[1, 2, 3, 4, 5].map(i => (
                <span key={i} className={`star ${i <= Math.round(v) ? 'filled' : ''}`}>
                    <IconStar filled={i <= Math.round(v)} width={14} height={14} />
                </span>
            ))}
        </span>
    );
};

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

const StoreCard = ({ store, onRate }) => {
    const [rating, setRating] = useState(store.userSubmittedRating || 0);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => { setRating(store.userSubmittedRating || 0); }, [store.userSubmittedRating]);

    const handleRate = async () => {
        if (!rating || rating < 1 || rating > 5) return;
        setSubmitting(true);
        try { await onRate(store.id, rating); }
        finally { setSubmitting(false); }
    };

    return (
        <div className="store-card">
            <div className="store-card-header">
                <button className="store-card-name store-card-name-link" onClick={() => navigate(`/stores/${store.id}`)}>
                    {store.name}
                </button>
            </div>
            <p className="store-card-address">{store.address}</p>

            <div className="store-ratings-row">
                <div className="rating-item">
                    <span className="rating-item-label">Overall</span>
                    <span className="rating-item-value highlighted">{store.overallRating ? parseFloat(store.overallRating).toFixed(1) : '—'}</span>
                </div>
                <div style={{ width: '1px', background: 'var(--border)' }} />
                <div className="rating-item">
                    <span className="rating-item-label">Your Rating</span>
                    <span className="rating-item-value">{store.userSubmittedRating || '—'}</span>
                </div>
                <div style={{ width: '1px', background: 'var(--border)' }} />
                <div className="rating-item">
                    <span className="rating-item-label">Stars</span>
                    <StarRating value={store.overallRating} />
                </div>
            </div>

            <div className="store-rating-action">
                <select className="rating-select" value={rating} onChange={e => setRating(Number(e.target.value))} disabled={submitting}>
                    <option value="0" disabled>Select rating…</option>
                    <option value="1">1 — Poor</option>
                    <option value="2">2 — Fair</option>
                    <option value="3">3 — Good</option>
                    <option value="4">4 — Very Good</option>
                    <option value="5">5 — Excellent</option>
                </select>
                <button className="btn-primary" onClick={handleRate} disabled={submitting || !rating}>
                    {submitting ? '…' : store.userSubmittedRating ? 'Update' : 'Rate'}
                </button>
            </div>
        </div>
    );
};

const UserDashboard = () => {
    const [stores, setStores] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const searchTerm = useDebouncedValue(searchInput, 300);
    const [searchType, setSearchType] = useState('name');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { api } = useAuth();
    const toast = useToast();

    const fetchStores = useCallback(async () => {
        setLoading(true); setError('');
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append(searchType, searchTerm);
            const response = await api.get(`/api/stores?${params.toString()}`);
            setStores(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch stores.');
        } finally { setLoading(false); }
    }, [api, searchTerm, searchType]);

    useEffect(() => { fetchStores(); }, [fetchStores]);

    const handleRatingSubmit = async (storeId, rating) => {
        try {
            await api.post(`/api/stores/${storeId}/ratings`, { rating });
            toast.success('Rating submitted.');
            fetchStores();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit rating.');
        }
    };

    const location = typeof window !== 'undefined' ? window.location.pathname : '/user';
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
                            <h1 className="page-title">Browse Stores</h1>
                            <p className="page-subtitle">Discover and rate stores on the platform</p>
                        </div>
                        <div className="page-body">
                            <div className="filter-bar">
                                <div className="search-input-wrapper">
                                    <span className="search-icon"><IconSearch width={16} height={16} /></span>
                                    <input
                                        placeholder={`Search by store ${searchType}…`}
                                        value={searchInput}
                                        onChange={e => setSearchInput(e.target.value)}
                                    />
                                </div>
                                <select className="filter-select" value={searchType} onChange={e => setSearchType(e.target.value)}>
                                    <option value="name">By Name</option>
                                    <option value="address">By Address</option>
                                </select>
                            </div>

                            {loading && (
                                <div className="stores-grid">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="store-card">
                                            <div className="skeleton" style={{ height: '24px', width: '60%', marginBottom: '0.75rem' }} />
                                            <div className="skeleton" style={{ height: '16px', width: '80%', marginBottom: '0.5rem' }} />
                                            <div className="skeleton" style={{ height: '60px' }} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {error && <div className="error-message"><IconAlert width={16} height={16} />{error}</div>}

                            {!loading && !error && (
                                stores.length === 0 ? (
                                    <div className="empty-state">
                                        <div className="empty-state-icon"><IconStorefront /></div>
                                        <p>No stores found matching your search.</p>
                                        {searchInput && <button className="btn-link" onClick={() => setSearchInput('')}>Clear search</button>}
                                    </div>
                                ) : (
                                    <div className="stores-grid">
                                        {stores.map(store => (
                                            <StoreCard key={store.id} store={store} onRate={handleRatingSubmit} />
                                        ))}
                                    </div>
                                )
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;