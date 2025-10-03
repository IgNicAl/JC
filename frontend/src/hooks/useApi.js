import { useState, useEffect, useCallback } from 'react';

/**
 * Hook customizado para encapsular a lógica de chamadas de API.
 * @param {function} apiFunc - A função do serviço da API a ser chamada.
 * @returns {{ data: any, loading: boolean, error: string, request: function }}
 */
export const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const request = useCallback(async (...args) => {
    setLoading(true);
    setError('');
    try {
      const response = await apiFunc(...args);
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Ocorreu um erro.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  return { data, loading, error, request };
};