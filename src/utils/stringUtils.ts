/**
 * Parses a comma-separated string into an array of trimmed strings.
 * 
 * This utility function is used to convert comma-separated values from the data source
 * into arrays that can be used in the application.
 * 
 * @param str - The comma-separated string to parse
 * @returns An array of trimmed strings, with empty values filtered out
 * 
 * @example
 * ```ts
 * // Returns ["Action", "Adventure", "RPG"]
 * parseStringToArray("Action, Adventure, RPG");
 * 
 * // Returns []
 * parseStringToArray("");
 * 
 * // Returns []
 * parseStringToArray(undefined);
 * ```
 */
export const parseStringToArray = (str: string | undefined): string[] => {
    if (!str) return [];
    return str.split(',').map(item => item.trim()).filter(Boolean);
};