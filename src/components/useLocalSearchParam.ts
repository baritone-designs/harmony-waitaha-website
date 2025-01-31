import { useEffect, useState } from 'react';
import { useSearchParam } from 'react-use';

export default function useLocalSearchParam(key: string) {
    const initialParam = useSearchParam(key);

    const [value, setValue] = useState(initialParam);

    useEffect(() => {
        const url = new URL(window.location.href);

        if (value === null) {
            url.searchParams.delete(key);
        } else {
            url.searchParams.set(key, value);
        }

        window.history.replaceState(window.history.state, '', url);
    }, [key, value]);

    return [value, setValue] as const;
}
