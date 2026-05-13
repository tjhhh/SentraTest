import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { buildApiUrl } from '@/config/api';

export function useDashboardStats() {
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    async function fetchData() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const [statsRes, recentRes] = await Promise.all([
          fetch(buildApiUrl('/system/stats'), { headers }),
          fetch(buildApiUrl('/system/recent'), { headers })
        ]);

        if (!statsRes.ok || !recentRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const statsData = await statsRes.json();
        const recentData = await recentRes.json();

        setStats(statsData.data);
        setRecentActivity(recentData.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { stats, recentActivity, isLoading, error };
}
