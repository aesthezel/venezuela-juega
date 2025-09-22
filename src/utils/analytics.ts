// Lightweight Google Analytics wrapper for custom events and page views
// Safe to import anywhere; functions are no-ops if gtag is unavailable.

// GA4 event type
export type GAParams = Record<string, any>;

// Detect gtag at runtime without crashing in SSR or tests
function getGtag(): ((type: string, event: string, params?: GAParams) => void) | null {
  try {
    // @ts-ignore
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      // @ts-ignore
      return window.gtag as any;
    }
  } catch {}
  return null;
}

export function trackEvent(eventName: string, params: GAParams = {}): void {
  const g = getGtag();
  if (!g) return;
  try {
    g('event', eventName, {
      ...params,
      // GA4 recommended fields when relevant
      page_location: typeof window !== 'undefined' ? window.location.href : undefined,
      page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
      page_title: typeof document !== 'undefined' ? document.title : undefined,
    });
  } catch (e) {
    // swallow to avoid breaking UX
  }
}

export function trackPageView(path?: string, title?: string): void {
  const g = getGtag();
  if (!g) return;
  try {
    g('event', 'page_view', {
      page_path: path ?? (typeof window !== 'undefined' ? window.location.pathname : undefined),
      page_location: typeof window !== 'undefined' ? window.location.href : undefined,
      page_title: title ?? (typeof document !== 'undefined' ? document.title : undefined),
    });
  } catch {}
}

// Common high-level helpers
export function trackNav(destination: string, source: string = 'header'): void {
  trackEvent('nav_click', { destination, source });
}

export function trackGameCardClick(game: { slug: string; title: string }, position?: number, layout?: 'grid' | 'list'): void {
  trackEvent('game_card_click', {
    game_slug: game.slug,
    game_title: game.title,
    position,
    layout,
  });
}

export function trackGameView(game: { slug: string; title: string }): void {
  trackEvent('view_game_detail', {
    game_slug: game.slug,
    game_title: game.title,
  });
}

export function trackGameSection(game: { slug: string; title: string }, section: string): void {
  trackEvent('game_section_click', {
    game_slug: game.slug,
    game_title: game.title,
    section,
  });
}

export function trackExternalStore(game: { slug: string; title: string }, storeName: string, url: string): void {
  trackEvent('game_external_click', {
    game_slug: game.slug,
    game_title: game.title,
    store: storeName,
    url,
  });
}

export function trackGameJam(action: string, extra: GAParams = {}): void {
  trackEvent(`gamejam_${action}`, extra);
}
