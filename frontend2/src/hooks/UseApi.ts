import { useState, useEffect } from "react";
import { ApiFunc, UseApiReturn } from "./interfaces/UseApiInterfaces"

export function useApi<T> (apiFunc: ApiFunc<T>, ...params: any[]): UseApiReturn<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await apiFunc(...params);
                setData(response.data);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiFunc, ...params]);

    return {data, loading, error};
}