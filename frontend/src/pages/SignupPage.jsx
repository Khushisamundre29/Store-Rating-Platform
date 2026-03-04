import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const validate = (fields) => {
    const errors = {};
    if (fields.name && (fields.name.length < 20 || fields.name.length > 60))
        errors.name = 'Name must be 20–60 characters.';
    if (fields.address && fields.address.length > 400)
        errors.address = 'Address must be under 400 characters.';
    if (fields.password) {
        const pw = fields.password;
        if (pw.length < 8 || pw.length > 16)
            errors.password = 'Password must be 8–16 characters.';
        else if (!/[A-Z]/.test(pw))
            errors.password = 'Must contain at least one uppercase letter.';
        else if (!/[^a-zA-Z0-9]/.test(pw))
            errors.password = 'Must contain at least one special character.';
    }
    return errors;
};

const SignupPage = () => {
    const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
    const [fieldErrors, setFieldErrors] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { api } = useAuth();
    const navigate = useNavigate();

    const handleChange = (field, val) => {
        setForm(f => ({ ...f, [field]: val }));
        const errs = validate({ [field]: val });
        setFieldErrors(e => ({ ...e, [field]: errs[field] || null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate(form);
        if (Object.keys(errs).length) { setFieldErrors(errs); return; }

        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await api.post('/api/auth/register', form);
            setSuccess('Account created! Redirecting to login…');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
                    <h2>Join the<br />community.</h2>
                    <p>Create your account and start discovering and rating stores in your area.</p>
                    <div className="auth-features">
                        {['Browse all registered stores', 'Submit & update your ratings', 'Track your rating history'].map(f => (
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
                    <h3>Create account</h3>
                    <p className="auth-form-subtitle">Fill in your details to get started</p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full name</label>
                            <input
                                type="text"
                                placeholder="Your full name (20–60 chars)"
                                value={form.name}
                                onChange={e => handleChange('name', e.target.value)}
                                required disabled={loading}
                            />
                            {fieldErrors.name && <div className="form-hint" style={{color:'var(--error)'}}>{fieldErrors.name}</div>}
                            <div className="form-hint">{form.name.length}/60 characters (min 20)</div>
                        </div>

                        <div className="form-group">
                            <label>Email address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={e => handleChange('email', e.target.value)}
                                required disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label>Address</label>
                            <textarea
                                placeholder="Your address (max 400 chars)"
                                value={form.address}
                                onChange={e => handleChange('address', e.target.value)}
                                required disabled={loading}
                                maxLength={400}
                            />
                            {fieldErrors.address && <div className="form-hint" style={{color:'var(--error)'}}>{fieldErrors.address}</div>}
                            <div className="form-hint">{form.address.length}/400 characters</div>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="8–16 chars, 1 uppercase, 1 special"
                                value={form.password}
                                onChange={e => handleChange('password', e.target.value)}
                                required disabled={loading}
                            />
                            {fieldErrors.password && <div className="form-hint" style={{color:'var(--error)'}}>{fieldErrors.password}</div>}
                        </div>

                        {error && <div className="error-message">⚠ {error}</div>}
                        {success && <div className="success-message">✓ {success}</div>}

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Creating account…' : 'Create account →'}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;