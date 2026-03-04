import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-panel-left">
                <div className="auth-brand">
                    <div className="auth-brand-logo">
                        <div className="auth-brand-icon">⭐</div>
                        <span className="auth-brand-name">RateStore</span>
                    </div>
                    <h2>Rate stores.<br />Shape experiences.</h2>
                    <p>A unified platform for users, store owners, and administrators to manage ratings and grow together.</p>
                    <div className="auth-features">
                        {['Real-time store ratings & analytics', 'Role-based access control', 'Comprehensive admin dashboard'].map(f => (
                            <div className="auth-feature" key={f}>
                                <div className="auth-feature-dot" />
                                <span>{f}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="auth-panel-right">
                <div className="auth-form-card">
                    <h3>Welcome back</h3>
                    <p className="auth-form-subtitle">Sign in to your account to continue</p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        {error && <div className="error-message">⚠ {error}</div>}

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Signing in…' : 'Sign in →'}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Don't have an account? <Link to="/signup">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;