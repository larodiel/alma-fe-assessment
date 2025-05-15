'use client';

import { useAppSelector } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Lead } from '@/types/Lead';
import { useEffect, useState } from 'react';

export function RecentActivity() {
  const leadsFromRedux = useAppSelector((state) => state.leads.items);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);

  useEffect(() => {
    // Use Redux state if available
    if (leadsFromRedux.length > 0) {
      const sortedLeads = [...leadsFromRedux]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      setRecentLeads(sortedLeads);
      return;
    }

    // Fallback to localStorage if Redux state is empty
    if (typeof window !== 'undefined') {
      try {
        const storedLeads = localStorage.getItem('leads');
        if (storedLeads) {
          const leads = JSON.parse(storedLeads) as Lead[];
          const sortedLeads = [...leads]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
          setRecentLeads(sortedLeads);
        }
      } catch (err) {
        console.error('Error loading leads from localStorage:', err);
      }
    }
  }, [leadsFromRedux]);

  if (recentLeads.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-2">Recent Activity</h3>
        <p className="text-gray-600">No recent activity to display.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {recentLeads.map((lead) => (
          <div key={lead.id} className="border-b pb-3 last:border-b-0">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">
                  {lead.firstName} {lead.lastName}
                </p>
                <p className="text-sm text-gray-500">{lead.email}</p>
              </div>
              <div className="text-right">
                <span
                  className={cn('inline-flex px-2 py-1 text-xs rounded-full', {
                    'bg-yellow-100 text-yellow-800': lead.status === 'PENDING',
                    'bg-blue-100 text-blue-800': lead.status === 'REACHED_OUT',
                  })}>
                  {lead.status.replace('_', ' ')}
                </span>
                <p className="text-xs text-gray-500 mt-1">{new Date(lead.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
