import { useState, useEffect, useCallback, useRef } from 'react';

// Custom hook for localStorage management
export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(`Error setting localStorage key "${key}":`, error);
      
      // Still update the state even if localStorage fails
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

// Auto-save hook with debouncing
export function useAutoSave<T>(
  data: T,
  saveFn: (data: T) => Promise<void> | void,
  delay: number = 2000
) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const previousDataRef = useRef<T>(data);
  const isFirstRender = useRef(true);

  const save = useCallback(async (dataToSave: T) => {
    try {
      setIsSaving(true);
      await saveFn(dataToSave);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [saveFn]);

  useEffect(() => {
    // Skip saving on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousDataRef.current = data;
      return;
    }

    // Check if data has actually changed
    if (JSON.stringify(data) === JSON.stringify(previousDataRef.current)) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced save
    timeoutRef.current = setTimeout(() => {
      save(data);
      previousDataRef.current = data;
    }, delay);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, save]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isSaving,
    lastSaved,
    forceSave: () => save(data),
  };
}

// Storage utilities for error handling
export const storageUtils = {
  isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  },

  getItem<T>(key: string, defaultValue: T): T {
    try {
      if (!storageUtils.isAvailable()) return defaultValue;
      
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  setItem<T>(key: string, value: T): boolean {
    try {
      if (!storageUtils.isAvailable()) return false;
      
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      return false;
    }
  },

  removeItem(key: string): boolean {
    try {
      if (!storageUtils.isAvailable()) return false;
      
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);  
      return false;
    }
  },

  clear(): boolean {
    try {
      if (!storageUtils.isAvailable()) return false;
      
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  getStorageInfo() {
    if (!storageUtils.isAvailable()) {
      return { available: false, used: 0, remaining: 0 };
    }

    try {
      let used = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length;
        }
      }

      return {
        available: true,
        used,
        remaining: 5 * 1024 * 1024 - used, // Assuming 5MB quota
      };
    } catch {
      return { available: true, used: 0, remaining: 0 };
    }
  },
};