import { useState, useMemo, useEffect } from 'preact/hooks';
import { prepare, layout, type PreparedText } from '@chenglou/pretext';

interface TextLayoutOptions {
  fontSize?: number;
  lineHeight?: number;
  fontFamily?: string;
  whiteSpace?: 'normal' | 'pre-wrap';
  wordBreak?: 'normal' | 'keep-all';
}

/**
 * Hook to calculate text layout (line count, height) using pretext.
 * This avoids DOM measurements and reflows.
 */
export function useTextLayout(
  text: string | undefined,
  containerWidth: number,
  options: TextLayoutOptions = {}
) {
  const {
    fontSize = 14,
    lineHeight = 20,
    fontFamily = "'Inter', 'SF Pro', system-ui, sans-serif",
    whiteSpace = 'normal',
    wordBreak = 'normal'
  } = options;

  const font = `${fontSize}px ${fontFamily}`;

  // 1. Prepare the text (one-time work when text/font changes)
  const prepared = useMemo(() => {
    if (!text) return null;
    return prepare(text, font, { whiteSpace, wordBreak });
  }, [text, font, whiteSpace, wordBreak]);

  // 2. Perform layout (cheap arithmetic when width/lineHeight changes)
  const layoutResult = useMemo(() => {
    if (!prepared || containerWidth <= 0) {
      return { height: 0, lineCount: 0 };
    }
    return layout(prepared, containerWidth, lineHeight);
  }, [prepared, containerWidth, lineHeight]);

  return {
    ...layoutResult,
    prepared
  };
}
