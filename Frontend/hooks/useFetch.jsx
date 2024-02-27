import { useEffect, useState } from 'react';

const useFetch = (url, options = {}, dependencies = []) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch(url, options);
                const json = await response.json();
                setData(json);
            } catch (error) {
                setError(error.message || "Failed to fetch");
            } finally {
                setIsLoading(false);
            }
        })();
    }, dependencies);

    return [data, error, isLoading]
};

export { useFetch }