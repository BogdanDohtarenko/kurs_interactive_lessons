import { useState, useEffect, useCallback } from 'react';

export const useFetch = (fetchFunction, autoFetch = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...params) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFunction(...params);
      setData(result.data || result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Ошибка сервера';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    if (autoFetch) {
      execute();
    }
  }, [autoFetch, execute]);

  return { data, loading, error, refetch: execute };
};