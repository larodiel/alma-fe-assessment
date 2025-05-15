import type {Lead} from '@/types/Lead';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// Helper to load state from localStorage
const loadState = (): Lead[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const serializedState = localStorage.getItem('leads');
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return [];
  }
};

// Helper to save state to localStorage
const saveState = (state: Lead[]) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('leads', serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

interface LeadsState {
  items: Lead[];
  loading: boolean;
  error: string | null;
}

const initialState: LeadsState = {
  items: loadState(),
  loading: false,
  error: null,
};

export const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addLead: (state, action: PayloadAction<Lead>) => {
      state.items.push(action.payload);
      saveState(state.items);
    },
    updateLead: (state, action: PayloadAction<{id: string; lead: Partial<Lead>}>) => {
      const {id, lead} = action.payload;
      const index = state.items.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.items[index] = {...state.items[index], ...lead};
        saveState(state.items);
      }
    },
    deleteLead: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((lead) => lead.id !== action.payload);
      saveState(state.items);
    },
  },
});

export const {setLoading, setError, addLead, updateLead, deleteLead} = leadsSlice.actions;

export default leadsSlice.reducer;
