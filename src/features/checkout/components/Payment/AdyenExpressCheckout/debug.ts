const ADYEN_EXPRESS_DEBUG_STORAGE_KEY = 'adyenExpressCheckout:debugLogs';

export const safeJsonStringify = (value: unknown) => {
    try {
        return JSON.stringify(
            value,
            (_key: string, v: unknown) => {
                if (typeof v === 'function') {
                    return `[Function ${v.name || 'anonymous'}]`;
                }
                if (v instanceof Error) {
                    return { name: v.name, message: v.message, stack: v.stack };
                }
                return v;
            },
            2,
        );
    } catch (e) {
        try {
            return JSON.stringify({ unserializable: true, error: String(e) });
        } catch {
            return '{"unserializable":true}';
        }
    }
};

export const debugLog = (event: string, payload: unknown) => {
    if (process.env.NEXT_PUBLIC_ADYEN_EXPRESS_CHECKOUT_DEBUG !== 'true') {
        return;
    }

    const entry = {
        ts: new Date().toISOString(),
        event,
        payload,
    };

    // Keep logs readable in the console and also persisted across navigations.
    const serialized = safeJsonStringify(entry);
    console.log(`[AdyenExpressCheckout] ${event}`, serialized);

    if (typeof window === 'undefined') {
        return;
    }

    try {
        const existing = window.sessionStorage.getItem(ADYEN_EXPRESS_DEBUG_STORAGE_KEY);
        const parsed: unknown = existing ? JSON.parse(existing) : [];
        const list = Array.isArray(parsed) ? parsed : [];
        list.push(entry);

        // Prevent sessionStorage blowups: keep only the most recent N entries.
        const MAX = 200;
        const trimmed = list.length > MAX ? list.slice(list.length - MAX) : list;
        window.sessionStorage.setItem(ADYEN_EXPRESS_DEBUG_STORAGE_KEY, safeJsonStringify(trimmed));
    } catch (e) {
        console.warn('[AdyenExpressCheckout] Failed to persist debug log', e);
    }
};