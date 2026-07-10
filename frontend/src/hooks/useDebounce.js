import { useEffect, useState } from 'react';

// Returns a copy of `value` that only updates after `delay` ms of silence.
// Used to stop firing an API call on every keystroke.
export const useDebouncedValue = (value, delay = 300) => {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
};