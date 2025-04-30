import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { ensureConfig, getConfig } from '@edx/frontend-platform';

ensureConfig(['STATIC_ASSETS_URL', 'API_URL'], 'DataProvider');
const API_URL = () => getConfig().API_URL;
const STATIC_ASSETS_URL = () => getConfig().STATIC_ASSETS_URL;
const API_ENDPOINT = () => `${STATIC_ASSETS_URL()}/api/config.json`;

const DataContext = createContext();

export function DataProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await fetch(API_ENDPOINT());
        if (!response.ok) {
          setError(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        setData(json);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const contextValue = useMemo(() => ({ data, loading, error }), [
    data,
    loading,
    error,
  ]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
