'use client';

import { useAppSelector } from '@/lib/store';
import { Lead } from '@/types/Lead';
import { useEffect, useState } from 'react';

export function DashboardStats() {
  const leadsFromRedux = useAppSelector((state) => state.leads.items);
  const [totalLeads, setTotalLeads] = useState<number>(0);
  const [newLeadsToday, setNewLeadsToday] = useState<number>(0);
  const [pendingLeads, setPendingLeads] = useState<number>(0);
  const [reachedOutLeads, setReachedOutLeads] = useState<number>(0);

  useEffect(() => {
    // Use Redux state if available
    if (leadsFromRedux.length > 0) {
      processLeads(leadsFromRedux);
      return;
    }

    // Fallback to localStorage if Redux state is empty
    if (typeof window !== 'undefined') {
      try {
        const storedLeads = localStorage.getItem('leads');
        if (storedLeads) {
          const leads = JSON.parse(storedLeads) as Lead[];
          processLeads(leads);
        }
      } catch (err) {
        console.error('Error loading leads from localStorage:', err);
      }
    }
  }, [leadsFromRedux]);

  const processLeads = (leads: Lead[]) => {
    // Set total leads
    setTotalLeads(leads.length);

    // Count leads by status
    let pending = 0;
    let reachedOut = 0;

    // Count new leads today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let newToday = 0;

    leads.forEach((lead) => {
      // Check if lead was created today
      const createdDate = new Date(lead.createdAt);
      if (createdDate >= today) {
        newToday++;
      }

      // Count by status
      switch (lead.status) {
        case 'PENDING':
          pending++;
          break;
        case 'REACHED_OUT':
          reachedOut++;
          break;
      }
    });

    setNewLeadsToday(newToday);
    setPendingLeads(pending);
    setReachedOutLeads(reachedOut);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Lead Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-500">Total Leads</p>
          <p className="text-2xl font-bold">{totalLeads}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-500">New Today</p>
          <p className="text-2xl font-bold">{newLeadsToday}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold">{pendingLeads}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-500">Reached Out</p>
          <p className="text-2xl font-bold">{reachedOutLeads}</p>
        </div>
      </div>
    </div>
  );
}