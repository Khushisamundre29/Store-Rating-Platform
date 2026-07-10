import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IconSeal, IconArrowRight, IconStar, IconStorefront,
    IconUsers, IconCheck,
} from '../components/icons/Icons';

const TICKER_ITEMS = [
    { name: 'Blue Bottle Coffee', city: 'Bandra West', rating: '4.8' },
    { name: 'Urban Threads', city: 'Koregaon Park', rating: '4.3' },
    { name: 'The Reading Room', city: 'Sadar, Nagpur', rating: '4.9' },
    { name: 'Spice Route Kitchen', city: 'Indiranagar', rating: '4.6' },
    { name: 'Craft & Co.', city: 'Hauz Khas', rating: '4.1' },
    { name: 'Northside Bakery', city: 'Andheri West', rating: '4.7' },
    { name: 'The Corner Bookshop', city: 'Civil Lines, Nagpur', rating: '4.9' },
    { name: 'Loom & Weave', city: 'MG Road', rating: '4.4' },
];

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="rs-land">
            <style>{`
                .rs-land {
                    height: 100vh;
                    overflow-y: auto;
                    background: var(--paper);
                    color: var(--text);
                }

                /* ---------- Nav ---------- */
                .rs-land-nav {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1.5rem 3rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .rs-land-nav-brand {
                    display: flex;
                    align-items: center;
                    gap: 0.55rem;
                    font-family: var(--font-display);
                    font-size: 1.15rem;
                    color: var(--ink);
                }
                .rs-land-nav-brand svg { color: var(--accent); }
                .rs-land-nav-actions { display: flex; gap: 1.5rem; align-items: center; }
                .rs-land-nav-link {
                    background: none;
                    border: none;
                    font-size: 0.88rem;
                    font-weight: 600;
                    color: var(--text-2);
                    cursor: pointer;
                    padding: 0;
                }
                .rs-land-nav-link:hover { color: var(--ink); }
                .rs-land-nav-cta {
                    position: relative;
                    background: var(--accent-tint);
                    color: var(--accent-dark);
                    border: 1px dashed var(--accent);
                    border-radius: 4px;
                    padding: 0.55rem 1.1rem;
                    font-size: 0.85rem;
                    font-weight: 700;
                    letter-spacing: 0.02em;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }
                .rs-land-nav-cta::before, .rs-land-nav-cta::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    width: 10px; height: 10px;
                    background: var(--paper);
                    border-radius: 50%;
                    transform: translateY(-50%);
                }
                .rs-land-nav-cta::before { left: -5px; }
                .rs-land-nav-cta::after { right: -5px; }

                /* ---------- Hero (light, type-led) ---------- */
                .rs-land-hero {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 3rem 3rem 3.5rem;
                }
                .rs-land-eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-family: var(--font-mono);
                    font-size: 0.72rem;
                    font-weight: 500;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: var(--accent-dark);
                    border: 1px solid var(--border);
                    padding: 0.3rem 0.7rem;
                    border-radius: 20px;
                    margin-bottom: 1.75rem;
                }
                .rs-land-eyebrow svg { color: var(--gold); }
                .rs-land-hero h1 {
                    font-family: var(--font-display);
                    font-weight: 500;
                    font-size: 4rem;
                    line-height: 1.05;
                    color: var(--ink);
                    max-width: 780px;
                    margin: 0 0 1.5rem;
                }
                .rs-land-hero h1 em {
                    font-style: italic;
                    color: var(--accent);
                }
                .rs-land-hero-sub {
                    font-size: 1.05rem;
                    color: var(--text-2);
                    line-height: 1.65;
                    max-width: 460px;
                    margin: 0 0 2.25rem;
                }
                .rs-land-hero-actions { display: flex; gap: 0.85rem; }
                .rs-land-btn-primary {
                    background: var(--accent);
                    color: #fff;
                    border: none;
                    border-radius: var(--radius-sm);
                    padding: 0.8rem 1.4rem;
                    font-size: 0.92rem;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: background 0.15s ease;
                }
                .rs-land-btn-primary:hover { background: var(--accent-dark); }
                .rs-land-btn-ghost {
                    background: transparent;
                    color: var(--ink);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    padding: 0.8rem 1.4rem;
                    font-size: 0.92rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: border-color 0.15s ease;
                }
                .rs-land-btn-ghost:hover { border-color: var(--accent); }

                /* ---------- Ticker (signature element) ---------- */
                .rs-land-ticker {
                    background: var(--ink);
                    overflow: hidden;
                    padding: 1.1rem 0;
                    border-top: 1px solid rgba(230,236,244,0.1);
                    border-bottom: 1px solid rgba(230,236,244,0.1);
                }
                .rs-land-ticker-track {
                    display: flex;
                    width: max-content;
                    gap: 2.5rem;
                    animation: rs-ticker-scroll 32s linear infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .rs-land-ticker-track { animation: none; }
                }
                @keyframes rs-ticker-scroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
                .rs-land-ticker-item {
                    display: flex;
                    align-items: baseline;
                    gap: 0.55rem;
                    white-space: nowrap;
                    font-size: 0.85rem;
                }
                .rs-land-ticker-name { color: #E6ECF4; font-weight: 600; }
                .rs-land-ticker-city { color: #7C8AA0; font-size: 0.78rem; }
                .rs-land-ticker-rating {
                    font-family: var(--font-mono);
                    color: #E7B95C;
                    font-weight: 500;
                }
                .rs-land-ticker-divider { color: #3A4A5E; }

                /* ---------- Sections ---------- */
                .rs-land-section {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 4.5rem 3rem;
                }
                .rs-land-section-head { margin-bottom: 2.75rem; max-width: 480px; }
                .rs-land-section-head span {
                    display: block;
                    font-family: var(--font-mono);
                    font-size: 0.72rem;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: var(--text-3);
                    margin-bottom: 0.6rem;
                }
                .rs-land-section-head h2 {
                    font-family: var(--font-display);
                    font-weight: 500;
                    font-size: 1.9rem;
                    color: var(--ink);
                    margin: 0 0 0.6rem;
                }
                .rs-land-section-head p { color: var(--text-2); font-size: 0.98rem; margin: 0; }

                /* ---------- Roles: asymmetric bento ---------- */
                .rs-land-bento {
                    display: grid;
                    grid-template-columns: 1.3fr 1fr;
                    grid-template-rows: repeat(2, 1fr);
                    gap: 1.1rem;
                }
                .rs-land-bento-card {
                    background: var(--surface);
                    border: 1px solid var(--border-soft);
                    border-radius: var(--radius);
                    padding: 1.85rem;
                    box-shadow: var(--shadow-card);
                }
                .rs-land-bento-card.large { grid-row: 1 / 3; display: flex; flex-direction: column; justify-content: center; }
                .rs-land-bento-icon {
                    width: 40px; height: 40px;
                    border-radius: var(--radius-sm);
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 1rem;
                }
                .rs-land-bento-card h3 {
                    font-family: var(--font-display);
                    font-weight: 500;
                    font-size: 1.1rem;
                    color: var(--ink);
                    margin: 0 0 0.5rem;
                }
                .rs-land-bento-card p { font-size: 0.87rem; color: var(--text-2); line-height: 1.55; margin: 0 0 1rem; }
                .rs-land-bento-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
                .rs-land-bento-list li { display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; color: var(--text-2); }
                .rs-land-bento-list svg { color: var(--accent); flex-shrink: 0; }

                /* ---------- How it works: receipt ---------- */
                .rs-land-receipt-wrap { display: flex; justify-content: center; }
                .rs-land-receipt {
                    position: relative;
                    background: var(--surface);
                    width: 100%;
                    max-width: 420px;
                    padding: 2rem 2rem 1.5rem;
                    font-family: var(--font-mono);
                    box-shadow: var(--shadow-card);
                }
                .rs-land-receipt::before, .rs-land-receipt::after {
                    content: '';
                    position: absolute;
                    left: 0; right: 0;
                    height: 12px;
                    background:
                        linear-gradient(-45deg, var(--paper) 6px, transparent 0),
                        linear-gradient(45deg, var(--paper) 6px, transparent 0);
                    background-size: 12px 12px;
                }
                .rs-land-receipt::before { top: -1px; background-position: left top; }
                .rs-land-receipt::after { bottom: -1px; transform: rotate(180deg); }
                .rs-land-receipt-head { text-align: center; margin-bottom: 1.25rem; }
                .rs-land-receipt-head strong {
                    display: block; font-size: 0.85rem; letter-spacing: 0.06em;
                    color: var(--ink); margin-bottom: 0.2rem;
                }
                .rs-land-receipt-head span { font-size: 0.72rem; color: var(--text-3); }
                .rs-land-receipt-rule { border-top: 1px dashed var(--border); margin: 0.9rem 0; }
                .rs-land-receipt-row { display: flex; gap: 0.85rem; padding: 0.6rem 0; align-items: flex-start; }
                .rs-land-receipt-num { color: var(--accent-dark); font-weight: 500; font-size: 0.8rem; flex-shrink: 0; }
                .rs-land-receipt-row div strong {
                    display: block; font-family: var(--font-body); font-weight: 600;
                    font-size: 0.88rem; color: var(--ink); margin-bottom: 0.15rem;
                }
                .rs-land-receipt-row div p {
                    margin: 0; font-family: var(--font-body); font-size: 0.8rem;
                    color: var(--text-2); line-height: 1.5;
                }
                .rs-land-receipt-foot {
                    text-align: center; font-size: 0.72rem; color: var(--text-3);
                    letter-spacing: 0.04em; margin-top: 0.5rem;
                }

                /* ---------- CTA: stamp ---------- */
                .rs-land-cta-wrap { max-width: 1200px; margin: 0 auto; padding: 0 3rem 5rem; }
                .rs-land-cta {
                    background: var(--ink);
                    border-radius: var(--radius);
                    padding: 2.75rem 3rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 2rem;
                    flex-wrap: wrap;
                }
                .rs-land-cta h2 {
                    font-family: var(--font-display);
                    font-weight: 500;
                    color: #F1F4F8;
                    font-size: 1.5rem;
                    margin: 0 0 0.4rem;
                }
                .rs-land-cta p { color: #B7C2D0; margin: 0; font-size: 0.92rem; }
                .rs-land-cta-btn {
                    position: relative;
                    background: #E7B95C;
                    color: var(--ink);
                    border: none;
                    border-radius: var(--radius-sm);
                    padding: 0.8rem 1.5rem;
                    font-weight: 700;
                    font-size: 0.92rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    white-space: nowrap;
                    transition: opacity 0.15s ease;
                }
                .rs-land-cta-btn::before, .rs-land-cta-btn::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    width: 10px; height: 10px;
                    background: var(--ink);
                    border-radius: 50%;
                    transform: translateY(-50%);
                }
                .rs-land-cta-btn::before { left: -5px; }
                .rs-land-cta-btn::after { right: -5px; }
                .rs-land-cta-btn:hover { opacity: 0.9; }

                /* ---------- Footer ---------- */
                .rs-land-footer {
                    border-top: 1px solid var(--border-soft);
                    padding: 1.75rem 3rem;
                    text-align: center;
                    color: var(--text-3);
                    font-size: 0.82rem;
                }

                @media (max-width: 860px) {
                    .rs-land-hero { padding: 2.5rem 1.5rem 2.5rem; }
                    .rs-land-hero h1 { font-size: 2.4rem; }
                    .rs-land-nav { padding: 1.25rem 1.5rem; }
                    .rs-land-section { padding: 3rem 1.5rem; }
                    .rs-land-bento { grid-template-columns: 1fr; grid-template-rows: none; }
                    .rs-land-bento-card.large { grid-row: auto; }
                    .rs-land-cta { padding: 2rem; flex-direction: column; text-align: center; }
                    .rs-land-cta-wrap { padding: 0 1.5rem 3.5rem; }
                }
            `}</style>

            {/* ---------- Nav ---------- */}
            <nav className="rs-land-nav">
                <div className="rs-land-nav-brand">
                    <IconSeal width={22} height={22} />
                    RateStore
                </div>
                <div className="rs-land-nav-actions">
                
                </div>
            </nav>

            {/* ---------- Hero ---------- */}
            <header className="rs-land-hero">
               
                <h1>Know which stores<br /><em>actually</em> deliver.</h1>
                <p className="rs-land-hero-sub">
                    RateStore connects users, store owners, and admins on one platform 
                    browse stores, leave honest ratings, and track performance in real time.
                </p>
                <div className="rs-land-hero-actions">
                    <button className="rs-land-btn-primary" onClick={() => navigate('/signup')}>
                        Create your account <IconArrowRight width={16} height={16} />
                    </button>
                    <button className="rs-land-btn-ghost" onClick={() => navigate('/login')}>
                        Sign in
                    </button>
                </div>
            </header>

            {/* ---------- Ticker ---------- */}
            <div className="rs-land-ticker">
                <div className="rs-land-ticker-track">
                    {[...TICKER_ITEMS, ...TICKER_ITEMS].map((s, i) => (
                        <div className="rs-land-ticker-item" key={i}>
                            <span className="rs-land-ticker-name">{s.name}</span>
                            <span className="rs-land-ticker-city">{s.city}</span>
                            <span className="rs-land-ticker-rating">★ {s.rating}</span>
                            <span className="rs-land-ticker-divider">/</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ---------- Roles ---------- */}
            <section className="rs-land-section">
                <div className="rs-land-section-head">
                    <span>Who it's for</span>
                    <h2>One platform, three roles</h2>
                    <p>Whether you're browsing, running a store, or managing the platform RateStore fits how you work.</p>
                </div>
                <div className="rs-land-bento">
                    <div className="rs-land-bento-card large">
                        <div className="rs-land-bento-icon" style={{ background: 'var(--accent-tint)', color: 'var(--accent-dark)' }}>
                            <IconUsers width={20} height={20} />
                        </div>
                        <h3>For Users</h3>
                        <p>Search stores by name or address, and rate the ones you visit.</p>
                        <ul className="rs-land-bento-list">
                            <li><IconCheck width={14} height={14} /> Browse every registered store</li>
                            <li><IconCheck width={14} height={14} /> Submit or update your rating anytime</li>
                            <li><IconCheck width={14} height={14} /> See what others are saying</li>
                        </ul>
                    </div>

                    <div className="rs-land-bento-card">
                        <div className="rs-land-bento-icon" style={{ background: 'var(--gold-tint)', color: 'var(--gold)' }}>
                            <IconStorefront width={20} height={20} />
                        </div>
                        <h3>For Store Owners</h3>
                        <p>Track your live average rating and see who rated you.</p>
                    </div>

                    <div className="rs-land-bento-card">
                        <div className="rs-land-bento-icon" style={{ background: 'var(--success-tint)', color: 'var(--success)' }}>
                            <IconSeal width={20} height={20} />
                        </div>
                        <h3>For Admins</h3>
                        <p>Manage every user, store, and platform-wide stat at a glance.</p>
                    </div>
                </div>
            </section>

            {/* ---------- How it works: receipt ---------- */}
            <section className="rs-land-section">
                <div className="rs-land-section-head">
                    <span>How it works</span>
                    <h2>Get started in three steps</h2>
                </div>
                <div className="rs-land-receipt-wrap">
                    <div className="rs-land-receipt">
                        <div className="rs-land-receipt-head">
                            <strong>RATESTORE · ORDER OF USE</strong>
                        </div>
                        <div className="rs-land-receipt-rule" />
                        <div className="rs-land-receipt-row">
                            <span className="rs-land-receipt-num">01</span>
                            <div>
                                <strong>Create your account</strong>
                                <p>Sign up as a user or a store owner pick the role that fits you.</p>
                            </div>
                        </div>
                        <div className="rs-land-receipt-row">
                            <span className="rs-land-receipt-num">02</span>
                            <div>
                                <strong>Find or list a store</strong>
                                <p>Users browse and search store owners get their dashboard set up.</p>
                            </div>
                        </div>
                        <div className="rs-land-receipt-row">
                            <span className="rs-land-receipt-num">03</span>
                            <div>
                                <strong>Rate and track</strong>
                                <p>Submit ratings or watch them roll in  updated in real time.</p>
                            </div>
                        </div>
                        <div className="rs-land-receipt-rule" />
                        <div className="rs-land-receipt-foot">* thank you for joining us *</div>
                    </div>
                </div>
            </section>

            {/* ---------- CTA ---------- */}
            <div className="rs-land-cta-wrap">
                <section className="rs-land-cta">
                    <div>
                        <h2>Ready to join RateStore?</h2>
                        <p>It takes less than a minute to create your account.</p>
                    </div>
                    <button className="rs-land-cta-btn" onClick={() => navigate('/signup')}>
                        Get started <IconArrowRight width={16} height={16} />
                    </button>
                </section>
            </div>

            <footer className="rs-land-footer">
                ©  Built for honest ratings.
            </footer>
        </div>
    );
};

export default LandingPage;