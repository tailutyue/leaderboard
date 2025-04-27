import { useState, useEffect } from 'react';
import { supabase, Cafe, HistoricalData, Insights } from '@/lib/supabase';

export function useCafes() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCafes() {
      try {
        const { data, error } = await supabase
          .from('Cafe')
          .select('*')
          .order('rank', { ascending: true });

        if (error) throw error;
        setCafes(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchCafes();
  }, []);

  return { cafes, loading, error };
}

export function useHistoricalData() {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistoricalData() {
      try {
        const { data, error } = await supabase
          .from('HistoricalData')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;
        setHistoricalData(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchHistoricalData();
  }, []);

  return { historicalData, loading, error };
}

export function useInsights() {
  const [insights, setInsights] = useState<Insights[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const { data, error } = await supabase
          .from('Insights')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;
        setInsights(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, []);

  return { insights, loading, error };
} 