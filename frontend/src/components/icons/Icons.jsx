import React from 'react';

// Shared stroke icon set — 20x20, 1.6px stroke, rounded joins.
// Replaces emoji usage across the app with a consistent, deliberate mark system.

const base = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
};

// Brand mark: a star held inside a seal ring — the "appraisal stamp" motif
// used as the RateStore logomark throughout the app.
export const IconSeal = (props) => (
    <svg {...base} {...props}>
        <circle cx="12" cy="12" r="9.25" />
        <path d="M12 7.2l1.4 2.9 3.2.46-2.3 2.26.55 3.18L12 14.4l-2.85 1.6.55-3.18-2.3-2.26 3.2-.46L12 7.2z" />
    </svg>
);

export const IconStar = ({ filled, ...props }) => (
    <svg {...base} {...props} fill={filled ? 'currentColor' : 'none'}>
        <path d="M12 4.8l2.24 4.66 5.06.73-3.66 3.63.87 5.1L12 16.4l-4.51 2.42.87-5.1-3.66-3.63 5.06-.73L12 4.8z" />
    </svg>
);

export const IconGrid = (props) => (
    <svg {...base} {...props}>
        <rect x="4" y="4" width="7" height="7" rx="1.2" />
        <rect x="13" y="4" width="7" height="7" rx="1.2" />
        <rect x="4" y="13" width="7" height="7" rx="1.2" />
        <rect x="13" y="13" width="7" height="7" rx="1.2" />
    </svg>
);

export const IconUsers = (props) => (
    <svg {...base} {...props}>
        <circle cx="9" cy="8.5" r="3.25" />
        <path d="M3.5 19c.7-3 2.9-4.75 5.5-4.75s4.8 1.75 5.5 4.75" />
        <path d="M15.75 5.6c1.5.3 2.6 1.65 2.6 3.2 0 1.55-1.1 2.9-2.6 3.2" />
        <path d="M17.2 14.35c2.05.5 3.5 2.05 4.05 4.65" />
    </svg>
);

export const IconStorefront = (props) => (
    <svg {...base} {...props}>
        <path d="M4 9.5l1-4.5h14l1 4.5" />
        <path d="M4 9.5a2.4 2.4 0 004.8 0 2.4 2.4 0 004.8 0 2.4 2.4 0 004.8 0" />
        <path d="M5 9.8V19h14V9.8" />
        <path d="M10 19v-4.5a2 2 0 014 0V19" />
    </svg>
);

export const IconKey = (props) => (
    <svg {...base} {...props}>
        <circle cx="8" cy="15" r="4" />
        <path d="M10.8 12.2L18 5" />
        <path d="M15.3 7.7l2.3 2.3" />
        <path d="M18.4 4.6l1.9 1.9" />
    </svg>
);

export const IconSearch = (props) => (
    <svg {...base} {...props}>
        <circle cx="10.5" cy="10.5" r="6.25" />
        <path d="M19 19l-4.3-4.3" />
    </svg>
);

export const IconLogOut = (props) => (
    <svg {...base} {...props}>
        <path d="M13 4H6.5A1.5 1.5 0 005 5.5v13A1.5 1.5 0 006.5 20H13" />
        <path d="M16.5 15.5L20.5 12l-4-3.5" />
        <path d="M20.5 12H10" />
    </svg>
);

export const IconAlert = (props) => (
    <svg {...base} {...props}>
        <path d="M12 3.5l9.5 16.5H2.5L12 3.5z" />
        <path d="M12 10v4" />
        <circle cx="12" cy="17.2" r="0.4" fill="currentColor" stroke="none" />
    </svg>
);

export const IconCheck = (props) => (
    <svg {...base} {...props}>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12.3l2.6 2.6L16.3 9" />
    </svg>
);

export const IconArrowRight = (props) => (
    <svg {...base} {...props}>
        <path d="M4.5 12h14" />
        <path d="M13 6.5l5.5 5.5-5.5 5.5" />
    </svg>
);

export const IconChevronUpDown = (props) => (
    <svg {...base} {...props} width={14} height={14}>
        <path d="M8 4.5l3.2 3.4H4.8L8 4.5z" />
        <path d="M8 19.5l-3.2-3.4h6.4L8 19.5z" />
    </svg>
);

export const IconChevronUp = (props) => (
    <svg {...base} {...props} width={14} height={14}>
        <path d="M5 15l7-7 7 7" />
    </svg>
);

export const IconChevronDown = (props) => (
    <svg {...base} {...props} width={14} height={14}>
        <path d="M5 9l7 7 7-7" />
    </svg>
);

export const IconEdit = (props) => (
    <svg {...base} {...props}>
        <path d="M14.5 5.5l4 4L8 20H4v-4L14.5 5.5z" />
        <path d="M12.5 7.5l4 4" />
    </svg>
);

export const IconTrash = (props) => (
    <svg {...base} {...props}>
        <path d="M5 7h14" />
        <path d="M9.5 7V5.2a1.2 1.2 0 011.2-1.2h2.6a1.2 1.2 0 011.2 1.2V7" />
        <path d="M7 7l.7 12a1.5 1.5 0 001.5 1.4h5.6a1.5 1.5 0 001.5-1.4L17 7" />
        <path d="M10.2 11v6" />
        <path d="M13.8 11v6" />
    </svg>
);

export const IconClose = (props) => (
    <svg {...base} {...props}>
        <path d="M6 6l12 12" />
        <path d="M18 6L6 18" />
    </svg>
);

export const IconPlus = (props) => (
    <svg {...base} {...props}>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
    </svg>
);

export const IconArrowLeft = (props) => (
    <svg {...base} {...props}>
        <path d="M19.5 12h-14" />
        <path d="M11 6.5L5.5 12l5.5 5.5" />
    </svg>
);