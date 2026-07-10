import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { IconSeal, IconAlert, IconCheck, IconArrowRight } from '../components/icons/Icons';

const EyeIcon = ({ open }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {open ? (
            <>
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                <circle cx="12" cy="12" r="3" />
            </>
        ) : (
            <>
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a18.5 18.5 0 0 1 4.22-5.06M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
            </>
        )}
    </svg>
);

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
    const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'USER' });
    const [fieldErrors, setFieldErrors] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
                        <span className="auth-brand-icon"><IconSeal /></span>
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
                            <label>I am a</label>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                {[
                                    { value: 'USER', label: 'Normal User' },
                                    { value: 'STORE_OWNER', label: 'Store Owner' },
                                ].map(opt => (
                                    <label
                                        key={opt.value}
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            padding: '0.65rem 0.75rem',
                                            borderRadius: '8px',
                                            border: `1.5px solid ${form.role === opt.value ? 'var(--primary, #2B85FF)' : 'var(--border)'}`,
                                            background: form.role === opt.value ? 'rgba(43,133,255,0.08)' : 'transparent',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value={opt.value}
                                            checked={form.role === opt.value}
                                            onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                                            disabled={loading}
                                            style={{ margin: 0 }}
                                        />
                                        {opt.label}
                                    </label>
                                ))}
                            </div>
                            <div className="form-hint">
                                {form.role === 'STORE_OWNER'
                                    ? "You'll get a dashboard to manage your store and view its ratings."
                                    : "You'll be able to browse and rate stores."}
                            </div>
                        </div>

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
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="8–16 chars, 1 uppercase, 1 special"
                                    value={form.password}
                                    onChange={e => handleChange('password', e.target.value)}
                                    required disabled={loading}
                                    style={{ paddingRight: '2.5rem', width: '100%' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(s => !s)}
                                    tabIndex={-1}
                                    style={{
                                        position: 'absolute',
                                        right: '0.75rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'var(--text-2)',
                                        display: 'flex',
                                        padding: 0,
                                    }}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    <EyeIcon open={showPassword} />
                                </button>
                            </div>
                            {fieldErrors.password && <div className="form-hint" style={{color:'var(--error)'}}>{fieldErrors.password}</div>}
                        </div>

                        {error && <div className="error-message"><IconAlert width={16} height={16} />{error}</div>}
                        {success && <div className="success-message"><IconCheck width={16} height={16} />{success}</div>}

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Creating account…' : <>Create account <IconArrowRight width={16} height={16} /></>}
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