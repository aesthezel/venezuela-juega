export const parseStringToArray = (str: string | undefined): string[] => {
    if (!str) return [];
    return str.split(',').map(item => item.trim()).filter(Boolean);
};

export const ensureHttps = (url: string | undefined): string | undefined => {
    if (!url) return undefined;
    return url.replace(/^http:\/\//i, 'https://');
};