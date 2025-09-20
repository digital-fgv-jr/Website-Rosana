export interface UseApiReturn<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
};

export type ApiFunc<T> = (...args: any[]) => Promise<{ data: T }>;