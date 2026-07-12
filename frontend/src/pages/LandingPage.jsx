import React, { useState, useEffect } from 'react';
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

// A small hand-drawn-feeling typewriter: types "Store Name  city  ★ rating",
// holds for a beat, deletes, moves to the next store.
const useTypewriter = (items, typeSpeed = 45, holdMs = 1400, deleteSpeed = 22) => {
    const [index, setIndex] = useState(0);
    const [text, setText] = useState('');
    const [phase, setPhase] = useState('typing'); // typing | holding | deleting

    useEffect(() => {
        const full = `${items[index].name} — ${items[index].city}  ★ ${items[index].rating}`;

        if (phase === 'typing') {
            if (text.length < full.length) {
                const t = setTimeout(() => setText(full.slice(0, text.length + 1)), typeSpeed);
                return () => clearTimeout(t);
            }
            const t = setTimeout(() => setPhase('holding'), holdMs);
            return () => clearTimeout(t);
        }

        if (phase === 'holding') {
            const t = setTimeout(() => setPhase('deleting'), 200);
            return () => clearTimeout(t);
        }

        if (phase === 'deleting') {
            if (text.length > 0) {
                const t = setTimeout(() => setText(text.slice(0, -1)), deleteSpeed);
                return () => clearTimeout(t);
            }
            setIndex((i) => (i + 1) % items.length);
            setPhase('typing');
        }
    }, [text, phase, index, items, typeSpeed, holdMs, deleteSpeed]);

    return text;
};

const LandingPage = () => {
    const navigate = useNavigate();
    const typedRating = useTypewriter(TICKER_ITEMS);

    return (
        <div className="rs-land">
            <style>{`
                .land {
                    height: 100vh;
                    overflow-y: auto;
                    background: var(--paper);
                    color: var(--text);
                }

                /* ---------- Nav ---------- */
                .land-nav {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1.5rem 3rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .land-nav-brand {
                    display: flex;
                    align-items: center;
                    gap: 0.55rem;
                    font-family: var(--font-display);
                    font-size: 1.15rem;
                    color: var(--ink);
                }
                .land-nav-brand svg { color: var(--accent); }
                .land-nav-actions { display: flex; gap: 1.5rem; align-items: center; }
                .land-nav-link {
                    background: none;
                    border: none;
                    font-size: 0.88rem;
                    font-weight: 600;
                    color: var(--text-2);
                    cursor: pointer;
                    padding: 0;
                }
                .land-nav-link:hover { color: var(--ink); }
                .land-nav-cta {
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
                .land-nav-cta::before, .land-nav-cta::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    width: 10px; height: 10px;
                    background: var(--paper);
                    border-radius: 50%;
                    transform: translateY(-50%);
                }
                .land-nav-cta::before { left: -5px; }
                .land-nav-cta::after { right: -5px; }

                /* ---------- Hero: text + storefronts illustration ---------- */
                .land-hero {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 3rem 3rem 3.5rem;
                    display: grid;
                    grid-template-columns: 1.1fr 0.9fr;
                    gap: 2.5rem;
                    align-items: center;
                }
                .land-eyebrow {
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
                .land-eyebrow svg { color: var(--gold); }
                .land-hero h1 {
                    font-family: var(--font-display);
                    font-weight: 500;
                    font-size: 3.6rem;
                    line-height: 1.08;
                    color: var(--ink);
                    max-width: 620px;
                    margin: 0 0 1.5rem;
                }
                .land-hero h1 em {
                    font-style: italic;
                    color: var(--accent);
                }
                .land-hero-sub {
                    font-size: 1.05rem;
                    color: var(--text-2);
                    line-height: 1.65;
                    max-width: 460px;
                    margin: 0 0 2.25rem;
                }
                .land-hero-actions { display: flex; gap: 0.85rem; }
                .land-btn-primary {
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
                .land-btn-primary:hover { background: var(--accent-dark); }
                .land-btn-ghost {
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
                .land-btn-ghost:hover { border-color: var(--accent); }

                /* ---------- Storefronts illustration ---------- */
                .land-storefronts {
                    position: relative;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    gap: 0.9rem;
                    height: 210px;
                    padding: 0 0.5rem;
                }
                .land-building {
                    position: relative;
                    border-radius: 6px 6px 0 0;
                    box-shadow: var(--shadow-card);
                }
                .land-building::before {
                    content: '';
                    position: absolute;
                    top: 10px; left: 10px; right: 10px;
                    height: 14px;
                    border-radius: 3px;
                    background: repeating-linear-gradient(
                        45deg, var(--rs-awning, var(--accent)) 0 8px,
                        var(--surface) 8px 16px
                    );
                }
                .land-building .door {
                    position: absolute;
                    bottom: 0; left: 50%;
                    transform: translateX(-50%);
                    width: 22px; height: 34px;
                    background: var(--ink);
                    border-radius: 4px 4px 0 0;
                }
                .land-building .window {
                    position: absolute;
                    width: 14px; height: 14px;
                    border-radius: 3px;
                    background: var(--accent-tint);
                    border: 1px solid var(--border);
                }
                .land-b1 { width: 84px; height: 130px; background: var(--surface); transform: rotate(-1.5deg); }
                .land-b1 .window { top: 40px; left: 14px; }
                .land-b1 .window:nth-child(3) { left: 50px; }
                .land-b2 { width: 100px; height: 170px; background: var(--surface); --rs-awning: var(--gold); transform: rotate(1deg); z-index: 1; }
                .land-b2 .window { top: 34px; left: 16px; }
                .land-b2 .window:nth-child(3) { left: 62px; }
                .land-b2 .window:nth-child(4) { top: 64px; left: 16px; }
                .land-b2 .window:nth-child(5) { top: 64px; left: 62px; }
                .land-b3 { width: 84px; height: 110px; background: var(--surface); --rs-awning: var(--success); transform: rotate(-0.5deg); }
                .land-b3 .window { top: 40px; left: 14px; }
                .land-b3 .window:nth-child(3) { left: 50px; }
                .land-b-star {
                    position: absolute;
                    top: -14px; left: 50%;
                    transform: translateX(-50%);
                    color: var(--gold);
                    animation: rs-star-bob 2.6s ease-in-out infinite;
                }
                @keyframes star-bob {
                    0%, 100% { transform: translateX(-50%) translateY(0); }
                    50% { transform: translateX(-50%) translateY(-4px); }
                }
                @media (prefers-reduced-motion: reduce) {
                    .land-b-star { animation: none; }
                }

                .land-typewriter {
                    max-width: 320px;
                    margin: 1rem auto 0;
                    text-align: center;
                    font-family: var(--font-mono);
                    font-size: 0.8rem;
                    color: var(--text-2);
                    min-height: 1.2em;
                }
                .land-typewriter-cursor {
                    display: inline-block;
                    width: 2px; height: 0.95em;
                    background: var(--accent);
                    margin-left: 2px;
                    vertical-align: text-bottom;
                    animation: rs-cursor-blink 1s step-end infinite;
                }
                @keyframes cursor-blink { 50% { opacity: 0; } }

                /* ---------- Ticker (signature element) ---------- */
                .land-ticker {
                    background: var(--ink);
                    overflow: hidden;
                    padding: 1.1rem 0;
                    border-top: 1px solid rgba(230,236,244,0.1);
                    border-bottom: 1px solid rgba(230,236,244,0.1);
                }
                .land-ticker-track {
                    display: flex;
                    width: max-content;
                    gap: 2.5rem;
                    animation: rs-ticker-scroll 32s linear infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .land-ticker-track { animation: none; }
                }
                @keyframes rs-ticker-scroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
                .land-ticker-item {
                    display: flex;
                    align-items: baseline;
                    gap: 0.55rem;
                    white-space: nowrap;
                    font-size: 0.85rem;
                }
                .land-ticker-name { color: #E6ECF4; font-weight: 600; }
                .land-ticker-city { color: #7C8AA0; font-size: 0.78rem; }
                .land-ticker-rating {
                    font-family: var(--font-mono);
                    color: #E7B95C;
                    font-weight: 500;
                }
                .land-ticker-divider { color: #3A4A5E; }

                /* ---------- Sections ---------- */
                .land-section {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 4.5rem 3rem;
                }
                .land-section-head { margin-bottom: 2.75rem; max-width: 480px; }
                .land-section-head span {
                    display: block;
                    font-family: var(--font-mono);
                    font-size: 0.72rem;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: var(--text-3);
                    margin-bottom: 0.6rem;
                }
                .land-section-head h2 {
                    font-family: var(--font-display);
                    font-weight: 500;
                    font-size: 1.9rem;
                    color: var(--ink);
                    margin: 0 0 0.6rem;
                }
                .land-section-head p { color: var(--text-2); font-size: 0.98rem; margin: 0; }

                /* ---------- Roles: asymmetric bento ---------- */
                .land-bento {
                    display: grid;
                    grid-template-columns: 1.3fr 1fr;
                    grid-template-rows: repeat(2, 1fr);
                    gap: 1.1rem;
                }
                .land-bento-card {
                    background: var(--surface);
                    border: 1px solid var(--border-soft);
                    border-radius: var(--radius);
                    padding: 1.85rem;
                    box-shadow: var(--shadow-card);
                }
                .land-bento-card.large { grid-row: 1 / 3; display: flex; flex-direction: column; justify-content: center; }
                .land-bento-icon {
                    width: 40px; height: 40px;
                    border-radius: var(--radius-sm);
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 1rem;
                }
                .land-bento-card h3 {
                    font-family: var(--font-display);
                    font-weight: 500;
                    font-size: 1.1rem;
                    color: var(--ink);
                    margin: 0 0 0.5rem;
                }
                .land-bento-card p { font-size: 0.87rem; color: var(--text-2); line-height: 1.55; margin: 0 0 1rem; }
                .land-bento-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
                .land-bento-list li { display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; color: var(--text-2); }
                .land-bento-list svg { color: var(--accent); flex-shrink: 0; }

                /* ---------- CTA: stamp ---------- */
                .land-cta-wrap { max-width: 1200px; margin: 0 auto; padding: 0 3rem 5rem; }
                .land-cta {
                    background: var(--ink);
                    border-radius: var(--radius);
                    padding: 2.75rem 3rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 2rem;
                    flex-wrap: wrap;
                }
                .land-cta h2 {
                    font-family: var(--font-display);
                    font-weight: 500;
                    color: #F1F4F8;
                    font-size: 1.5rem;
                    margin: 0 0 0.4rem;
                }
                .land-cta p { color: #B7C2D0; margin: 0; font-size: 0.92rem; }
                .land-cta-btn {
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
                .land-cta-btn::before, .land-cta-btn::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    width: 10px; height: 10px;
                    background: var(--ink);
                    border-radius: 50%;
                    transform: translateY(-50%);
                }
                .land-cta-btn::before { left: -5px; }
                .land-cta-btn::after { right: -5px; }
                .land-cta-btn:hover { opacity: 0.9; }

                /* ---------- Footer ---------- */
                .land-footer {
                    border-top: 1px solid var(--border-soft);
                    padding: 1.75rem 3rem;
                    text-align: center;
                    color: var(--text-3);
                    font-size: 0.82rem;
                }

                @media (max-width: 860px) {
                    .land-hero { grid-template-columns: 1fr; padding: 2.5rem 1.5rem 2.5rem; }
                    .land-hero h1 { font-size: 2.4rem; }
                    .land-nav { padding: 1.25rem 1.5rem; }
                    .land-section { padding: 3rem 1.5rem; }
                    .land-bento { grid-template-columns: 1fr; grid-template-rows: none; }
                    .land-bento-card.large { grid-row: auto; }
                    .land-cta { padding: 2rem; flex-direction: column; text-align: center; }
                    .land-cta-wrap { padding: 0 1.5rem 3.5rem; }
                }
            `}</style>

            {/* ---------- Nav ---------- */}
            <nav className="land-nav">
                <div className="land-nav-brand">
                    <IconSeal width={22} height={22} />
                    RateStore
                </div>
                <div className="land-nav-actions">
                
                </div>
            </nav>

            {/* ---------- Hero ---------- */}
            <header className="land-hero">
                <div>
                    <h1>Know which stores<br /><em>actually</em> deliver.</h1>
                    <p className="land-hero-sub">
                        RateStore connects users, store owners, and admins on one platform 
                        browse stores, leave honest ratings, and track performance in real time.
                    </p>
                    <div className="land-hero-actions">
                        <button className="land-btn-primary" onClick={() => navigate('/signup')}>
                            Create your account <IconArrowRight width={16} height={16} />
                        </button>
                        <button className="land-btn-ghost" onClick={() => navigate('/login')}>
                            Sign in
                        </button>
                    </div>
                </div>

                <div>
                    <div className="land-storefronts">
                        <div className="land-building rs-land-b1">
                            <span className="window" />
                            <span className="window" />
                            <span className="door" />
                        </div>
                        <div className="land-building rs-land-b2">
                            <IconStar filled width={16} height={16} className="land-b-star" />
                            <span className="window" />
                            <span className="window" />
                            <span className="window" />
                            <span className="window" />
                            <span className="door" />
                        </div>
                        <div className="land-building land-b3">
                            <span className="window" />
                            <span className="window" />
                            <span className="door" />
                        </div>
                    </div>
                    <div className="land-typewriter">
                        {typedRating}
                        <span className="land-typewriter-cursor" />
                    </div>
                </div>
            </header>

            {/* ---------- Ticker ---------- */}
            <div className="land-ticker">
                <div className="land-ticker-track">
                    {[...TICKER_ITEMS, ...TICKER_ITEMS].map((s, i) => (
                        <div className="land-ticker-item" key={i}>
                            <span className="land-ticker-name">{s.name}</span>
                            <span className="land-ticker-city">{s.city}</span>
                            <span className="land-ticker-rating">★ {s.rating}</span>
                            <span className="land-ticker-divider">/</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ---------- Roles ---------- */}
            <section className="land-section">
                <div className="land-section-head">
                    <span>Who it's for</span>
                    <h2>One platform, three roles</h2>
                    <p>Whether you're browsing, running a store, or managing the platform RateStore fits how you work.</p>
                </div>
                <div className="land-bento">
                    <div className="land-bento-card large">
                        <div className="land-bento-icon" style={{ background: 'var(--accent-tint)', color: 'var(--accent-dark)' }}>
                            <IconUsers width={20} height={20} />
                        </div>
                        <h3>For Users</h3>
                        <p>Search stores by name or address, and rate the ones you visit.</p>
                        <ul className="land-bento-list">
                            <li><IconCheck width={14} height={14} /> Browse every registered store</li>
                            <li><IconCheck width={14} height={14} /> Submit or update your rating anytime</li>
                            <li><IconCheck width={14} height={14} /> See what others are saying</li>
                        </ul>
                    </div>

                    <div className="land-bento-card">
                        <div className="land-bento-icon" style={{ background: 'var(--gold-tint)', color: 'var(--gold)' }}>
                            <IconStorefront width={20} height={20} />
                        </div>
                        <h3>For Store Owners</h3>
                        <p>Track your live average rating and see who rated you.</p>
                    </div>

                    <div className="land-bento-card">
                        <div className="land-bento-icon" style={{ background: 'var(--success-tint)', color: 'var(--success)' }}>
                            <IconSeal width={20} height={20} />
                        </div>
                        <h3>For Admins</h3>
                        <p>Manage every user, store, and platform-wide stat at a glance.</p>
                    </div>
                </div>
            </section>

            {/* ---------- CTA ---------- */}
            <div className="land-cta-wrap">
                <section className="land-cta">
                    <div>
                        <h2>Ready to join RateStore?</h2>
                        <p>It takes less than a minute to create your account.</p>
                    </div>
                    <button className="land-cta-btn" onClick={() => navigate('/signup')}>
                        Get started <IconArrowRight width={16} height={16} />
                    </button>
                </section>
            </div>

            <footer className="land-footer">
                © 2026 Store Rating Platform. All rights reserved by Khushi Samundre. 
            </footer>
        </div>
    );
};

export default LandingPage;