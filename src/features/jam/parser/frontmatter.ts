/**
 * Lightweight and robust YAML/JSON frontmatter parser for Game Jam content files.
 */

export interface ParsedFrontmatter {
    attributes: Record<string, any>;
    body: string;
}

function parseScalar(val: string): any {
    const trimmed = val.trim();
    if (trimmed === '') return '';
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
    if (trimmed === 'null') return null;

    // Number check
    if (!isNaN(Number(trimmed)) && !trimmed.startsWith('0x') && /^-?\d+(\.\d+)?$/.test(trimmed)) {
        return Number(trimmed);
    }

    // Quoted strings
    if (
        (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
        return trimmed.slice(1, -1);
    }

    // Date ISO format check (YYYY-MM-DD or full ISO)
    if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}.*)?$/.test(trimmed)) {
        const d = new Date(trimmed);
        if (!isNaN(d.getTime())) return d;
    }

    // Inline array: [a, b, c]
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        const inner = trimmed.slice(1, -1).trim();
        if (!inner) return [];
        return inner.split(',').map((s) => parseScalar(s));
    }

    return trimmed;
}

/**
 * Simple YAML parser that supports keys, values, nested objects, and lists.
 */
export function parseYaml(yamlText: string): Record<string, any> {
    const lines = yamlText.split(/\r?\n/);
    const result: Record<string, any> = {};

    let currentKey = '';
    let currentList: any[] | null = null;
    let currentObject: Record<string, any> | null = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Skip empty lines or full comment lines
        if (!trimmed || trimmed.startsWith('#')) continue;

        // Detect indentation
        const indent = line.search(/\S/);

        // List item under a key: "  - item" or "- item"
        if (trimmed.startsWith('- ')) {
            const itemVal = trimmed.slice(2).trim();

            if (!currentList) {
                currentList = [];
                if (currentKey) {
                    result[currentKey] = currentList;
                }
            }

            // Check if list item is key-value pair: "- key: value"
            const colonIdx = itemVal.indexOf(':');
            if (colonIdx > 0 && !itemVal.startsWith('http://') && !itemVal.startsWith('https://')) {
                const subKey = itemVal.slice(0, colonIdx).trim();
                const subVal = itemVal.slice(colonIdx + 1).trim();
                const objItem: Record<string, any> = {};
                objItem[subKey] = parseScalar(subVal);
                currentList.push(objItem);
            } else {
                currentList.push(parseScalar(itemVal));
            }
            continue;
        }

        // Key-value pair at root or sub-level
        const colonIdx = trimmed.indexOf(':');
        if (colonIdx > -1) {
            const key = trimmed.slice(0, colonIdx).trim();
            const val = trimmed.slice(colonIdx + 1).trim();

            if (indent > 0 && currentObject && currentKey) {
                // Sub-property
                currentObject[key] = parseScalar(val);
                continue;
            }

            // Reset current list/object context for top-level key
            currentKey = key;
            currentList = null;

            if (val === '') {
                // Could be parent of list or nested object
                currentObject = {};
                result[key] = currentObject;
            } else {
                currentObject = null;
                result[key] = parseScalar(val);
            }
        }
    }

    // Clean up empty objects if they turned out to be list containers
    for (const k of Object.keys(result)) {
        if (result[k] && typeof result[k] === 'object' && !Array.isArray(result[k])) {
            if (Object.keys(result[k]).length === 0) {
                // check if empty
            }
        }
    }

    return result;
}

/**
 * Extracts frontmatter delimited by `---` and returns attributes + body.
 */
export function extractFrontmatter(rawContent: string): ParsedFrontmatter {
    const trimmed = rawContent.trim();

    // Check for JSON directly
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        try {
            const parsed = JSON.parse(trimmed);
            return { attributes: parsed, body: '' };
        } catch {
            // fallback
        }
    }

    // Frontmatter regex: matches opening --- and closing ---
    const match = rawContent.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]*([\s\S]*)$/);

    if (match) {
        const yamlStr = match[1];
        const bodyStr = match[2] || '';
        const attributes = parseYaml(yamlStr);
        return { attributes, body: bodyStr.trim() };
    }

    return { attributes: {}, body: rawContent.trim() };
}
