import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export function useCities() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCities() {
      try {
        const data = await api.get('/locations/cities');
        setCities(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCities();
  }, []);

  const getCitiesByCountry = () => {
    // Note: In the new MySQL schema, we currently only have US states.
    // We can add a country column to states/cities if needed, 
    // but the request was specifically for US states.
    const grouped = {
      "United States": [],
      "Canada": []
    };
    cities.forEach(city => {
      // For now, assuming all cities are in US as per request
      grouped["United States"].push(city);
    });
    return grouped;
  };

  return { cities, loading, error, getCitiesByCountry };
}
