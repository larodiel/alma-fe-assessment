'use client';

import {Lead} from '@/types/Lead';
import {useCallback, useEffect, useState} from 'react';

// Custom hook for managing leads in localStorage
export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load leads from localStorage
  useEffect(() => {
    const loadLeads = () => {
      try {
        setIsLoading(true);
        const storedLeads = localStorage.getItem('leads');
        if (storedLeads) {
          setLeads(JSON.parse(storedLeads));
        } else {
          setLeads([]);
        }
        setError(null);
      } catch (err) {
        console.error('Error loading leads from localStorage:', err);
        setError('Failed to load leads');
        setLeads([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeads();
  }, []);

  // Save leads to localStorage
  const saveLeads = useCallback((updatedLeads: Lead[]) => {
    try {
      localStorage.setItem('leads', JSON.stringify(updatedLeads));
      setLeads(updatedLeads);
      setError(null);
    } catch (err) {
      console.error('Error saving leads to localStorage:', err);
      setError('Failed to save leads');
    }
  }, []);

  // Add a new lead
  const addLead = useCallback(
    (lead: Lead) => {
      const updatedLeads = [...leads, lead];
      saveLeads(updatedLeads);
      return lead;
    },
    [leads, saveLeads]
  );

  // Update an existing lead
  const updateLead = useCallback(
    (id: string, updatedData: Partial<Lead>) => {
      const leadIndex = leads.findIndex((lead) => lead.id === id);
      if (leadIndex === -1) {
        setError(`Lead with ID ${id} not found`);
        return null;
      }

      const updatedLeads = [...leads];
      updatedLeads[leadIndex] = {
        ...updatedLeads[leadIndex],
        ...updatedData,
        updatedAt: new Date().toISOString(),
      };

      saveLeads(updatedLeads);
      return updatedLeads[leadIndex];
    },
    [leads, saveLeads]
  );

  // Delete a lead
  const deleteLead = useCallback(
    (id: string) => {
      const updatedLeads = leads.filter((lead) => lead.id !== id);
      saveLeads(updatedLeads);
    },
    [leads, saveLeads]
  );

  return {
    leads,
    isLoading,
    error,
    addLead,
    updateLead,
    deleteLead,
  };
}
