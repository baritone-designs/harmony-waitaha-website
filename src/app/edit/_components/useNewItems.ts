import { useCallback, useState } from 'react';

/**
 * Tracks unsaved "new item" forms by a temporary key
 */
export default function useNewItems() {
    const [keys, setKeys] = useState<string[]>([]);

    const add = useCallback(() => setKeys((current) => [Math.random().toString(36).slice(2, 9), ...current]), []);

    const remove = useCallback((key: string) => setKeys((current) => current.filter((x) => x !== key)), []);

    return [keys, add, remove] as const;
}
