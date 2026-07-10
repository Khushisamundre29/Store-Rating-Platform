import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/layout/Sidebar';
import { IconArrowLeft, IconStar, IconAlert, IconUsers } from '../components/icons/Icons';

const StarRating = ({ value, size = 15 }) => {
    const v = parseFloat(value) || 0;
    return (
        <span className="stars">
            {[1, 2, 3, 4, 5].map(i => (
                <span key={i} className={`star ${i <= Math.round(v) ? 'filled' : ''}`}>
                    <IconStar filled={i <= Math.round(v)} width={size} height={size} />
                </span>
            ))}
        </span>
    );
};

const ReviewRow = ({ review }) => (
    <div className="review-row">
        <div className="review-row-top">
            <span className="review-author">{review.name}</span>
            <span className="review-date">
                {new Date(review.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
        </div>
        <StarRating value={review.rating} size={14} />
    </div>
);

const StoreDetailsPage = () => {
    const { storeId } = useParams();
    const navigate = useNavigate();
    const { api, user } = useAuth();
    const toast = useToast();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [rating, setRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const fetchDetails = useCallback(async () => {
        setLoading(true); setError('');
        try {
            const res = await api.get(`/api/stores/${storeId}/details`);
            setData(res.data);
            setRating(res.data.userSubmittedRating || 0);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load store details.');
        } finally {
            setLoading(false);
        }
    }, [api, storeId]);

    useEffect(() => { fetchDetails(); }, [fetchDetails]);

    const handleRate = async () => {
        if (!rating || rating < 1 || rating > 5) return;
        setSubmitting(true);
        try {
            await api.post(`/api/stores/${storeId}/ratings`, { rating });
            toast.success('Rating submitted.');
            fetchDetails();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit rating.');
        } finally {
            setSubmitting(false);
        }
    };

    const isNormalUser = user?.role?.toUpperCase() === 'USER';

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <button className="back-link" onClick={() => navigate(-1)}>
                    <IconArrowLeft width={16} height={16} /> Back
                </button>

                {loading ? (
                    <div className="page-body">
                        <div className="skeleton" style={{ height: '32px', width: '40%', marginBottom: '0.75rem' }} />
                        <div className="skeleton" style={{ height: '16px', width: '60%', marginBottom: '1.5rem' }} />
                        <div className="skeleton" style={{ height: '120px', marginBottom: '1.5rem' }} />
                        <div className="skeleton" style={{ height: '200px' }} />
                    </div>
                ) : error ? (
                    <div className="page-body">
                        <div className="error-message"><IconAlert width={16} height={16} />{error}</div>
                    </div>
                ) : (
                    <div className="page-body">
                        <div className="page-header">
                            <h1 className="page-title">{data.store.name}</h1>
                            <p className="page-subtitle">{data.store.address}</p>
                        </div>

                        <div className="store-ratings-row" style={{ maxWidth: '520px', marginBottom: '2rem' }}>
                            <div className="rating-item">
                                <span className="rating-item-label">Overall</span>
                                <span className="rating-item-value highlighted">
                                    {data.overallRating ? parseFloat(data.overallRating).toFixed(1) : '—'}
                                </span>
                            </div>
                            <div style={{ width: '1px', background: 'var(--border)' }} />
                            <div className="rating-item">
                                <span className="rating-item-label">Reviews</span>
                                <span className="rating-item-value">{data.totalRatings}</span>
                            </div>
                            <div style={{ width: '1px', background: 'var(--border)' }} />
                            <div className="rating-item">
                                <span className="rating-item-label">Stars</span>
                                <StarRating value={data.overallRating} />
                            </div>
                        </div>

                        {isNormalUser && (
                            <div className="password-section" style={{ maxWidth: '520px', marginBottom: '2rem' }}>
                                <h3 style={{ marginBottom: '1rem', fontSize: '1.02rem' }}>
                                    {data.userSubmittedRating ? 'Update your rating' : 'Rate this store'}
                                </h3>
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
                                        {submitting ? '…' : data.userSubmittedRating ? 'Update' : 'Rate'}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="section-header">
                            <span className="section-title">All Reviews</span>
                        </div>

                        {data.reviews.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon"><IconUsers /></div>
                                <p>No reviews yet.</p>
                            </div>
                        ) : (
                            <div className="reviews-list">
                                {data.reviews.map((r, i) => <ReviewRow key={i} review={r} />)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoreDetailsPage;