'use client';

import { useEffect } from 'react';
import { getAnalytics } from '@/lib/datafast';

export function DataFastAnalytics() {
  useEffect(() => {
    getAnalytics();
  }, []);

  return null;
}
