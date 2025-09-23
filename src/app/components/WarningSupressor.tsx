'use client';

import { useEffect } from 'react';

export default function WarningSupressor() {
  useEffect(() => {
    // Suppress Ant Design React 19 compatibility warning immediately
    const originalWarn = console.warn;
    const originalError = console.error;
    
    console.warn = (...args) => {
      const message = String(args[0] || '');
      // Filter out Ant Design React compatibility warnings
      if (
        message.includes('antd: compatible') || 
        message.includes('React is 16 ~ 18') ||
        message.includes('v5-for-19') ||
        message.includes('antd v5 support React is 16')
      ) {
        return;
      }
      originalWarn(...args);
    };

    console.error = (...args) => {
      const message = String(args[0] || '');
      // Filter out Ant Design React compatibility errors
      if (
        message.includes('antd: compatible') || 
        message.includes('React is 16 ~ 18') ||
        message.includes('v5-for-19') ||
        message.includes('antd v5 support React is 16')
      ) {
        return;
      }
      originalError(...args);
    };

    // Cleanup function to restore original console methods when component unmounts
    return () => {
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  return null; // This component doesn't render anything
}
