import React, { createContext, useState, useEffect, useContext } from 'react';
import { ensureConfig, getConfig } from '@edx/frontend-platform';

ensureConfig(['STATIC_ASSETS_URL'], 'Livedata');
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

  return (
    <DataContext.Provider value={{ data, loading, error }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
