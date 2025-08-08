import { useState, useEffect } from 'preact/hooks';

/**
 * A custom hook that delays updating a value until a specified delay has passed.
 * 
 * This is useful for reducing the frequency of updates in response to rapidly changing values,
 * such as search input, to improve performance and reduce unnecessary operations.
 * 
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds before updating the debounced value
 * @returns The debounced value
 * 
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 * 
 * // Use debouncedSearchTerm for search operations
 * useEffect(() => {
 *   // This effect will only run 300ms after the user stops typing
 *   performSearch(debouncedSearchTerm);
 * }, [debouncedSearchTerm]);
 * ```
 */
export const useDebounce = <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};