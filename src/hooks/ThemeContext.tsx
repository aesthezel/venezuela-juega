import { createContext } from 'preact';
import { useContext, useState, useEffect } from 'preact/hooks';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const resolveInitialTheme = (): Theme => {
    try {
        const saved = localStorage.getItem('vj-theme');
        if (saved === 'light' || saved === 'dark') return saved;
    } catch { }
    return 'dark'; 
};

const initialTheme = resolveInitialTheme();
document.documentElement.classList.add(initialTheme);
document.documentElement.setAttribute('data-theme', initialTheme);

export const ThemeProvider = ({ children }: { children: any }) => {
    const [theme, setTheme] = useState<Theme>(initialTheme);

    // Sync theme class immediately on state change
    useEffect(() => {
        try {
            localStorage.setItem('vj-theme', theme);
        } catch { }
    }, [theme]);

    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';

        const switchTheme = () => {
            // SYNC UPDATE: Must happen inside the transition callback
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(nextTheme);
            document.documentElement.setAttribute('data-theme', nextTheme);
            setTheme(nextTheme);
        };

        if (!(document as any).startViewTransition) {
            switchTheme();
            return;
        }

        (document as any).startViewTransition(switchTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};
