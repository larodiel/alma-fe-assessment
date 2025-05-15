'use client';

import { store } from '@/lib/store';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

export function ReduxProvider({ children }: PropsWithChildren) {
  return <Provider store={store}>{children}</Provider>;
}
