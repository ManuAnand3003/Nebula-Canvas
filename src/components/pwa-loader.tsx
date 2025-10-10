"use client";

import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const PwaLoader = () => {
  const { toast } = useToast();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error);
            toast({
              title: "Offline Mode Failed",
              description: "Could not prepare the app for offline use.",
              variant: "destructive",
            });
          });
      });
    }
  }, [toast]);

  return null;
};

export default PwaLoader;
