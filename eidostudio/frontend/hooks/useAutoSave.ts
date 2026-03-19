import { useState, useEffect, useRef } from 'react';
import { Project } from '../types';

type AutoSaveState = 'idle' | 'pending' | 'saving' | 'saved' | 'error' | 'waiting';

interface UseAutoSaveOptions {
  isEditing: boolean;
  currentData: Partial<Project>;
  saveFunction: (project: Project) => Promise<void>;
  normalizeFunction: (data: Partial<Project>) => Project | null;
  dependencies?: unknown[];
}

interface UseAutoSaveReturn {
  autoSaveState: AutoSaveState;
  lastAutoSaveAt: Date | null;
  isAutoSaving: boolean;
  hasCreatedOnServer: boolean;
  setHasCreatedOnServer: (value: boolean) => void;
}

/**
 * Custom hook for auto-saving data with debouncing
 * Handles auto-save state management, debouncing, and conflict resolution
 */
export function useAutoSave({
  isEditing,
  currentData,
  saveFunction,
  normalizeFunction,
  dependencies = [],
}: UseAutoSaveOptions): UseAutoSaveReturn {
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [autoSaveState, setAutoSaveState] = useState<AutoSaveState>('idle');
  const [lastAutoSaveAt, setLastAutoSaveAt] = useState<Date | null>(null);

  const autoSaveTimeoutRef = useRef<number | null>(null);
  const lastSavedSnapshotRef = useRef<string>('');
  const hasCreatedOnServerRef = useRef<boolean>(false);
  const needsAutoSaveRef = useRef<boolean>(false);
  const latestDataRef = useRef<Partial<Project>>({});

  // Keep latest data in ref for async access
  useEffect(() => {
    latestDataRef.current = currentData;
  }, [currentData]);

  // Reset last saved snapshot when starting to edit
  useEffect(() => {
    if (isEditing && hasCreatedOnServerRef.current) {
      const normalized = normalizeFunction(currentData);
      if (normalized) {
        lastSavedSnapshotRef.current = JSON.stringify(normalized);
        setAutoSaveState('saved');
      }
    }
  }, [isEditing, normalizeFunction, currentData]);

  const executeAutoSave = async () => {
    const normalized = normalizeFunction(latestDataRef.current);
    if (!normalized) return;

    if (!normalized.title) {
      setAutoSaveState('waiting');
      return;
    }

    const snapshot = JSON.stringify(normalized);
    if (snapshot === lastSavedSnapshotRef.current) {
      setAutoSaveState('saved');
      return;
    }

    setIsAutoSaving(true);
    setAutoSaveState('saving');
    try {
      await saveFunction(normalized);
      hasCreatedOnServerRef.current = true;
      lastSavedSnapshotRef.current = snapshot;
      setLastAutoSaveAt(new Date());
      setAutoSaveState('saved');
    } catch (error) {
      console.error('Auto-save error:', error);
      setAutoSaveState('error');
    } finally {
      setIsAutoSaving(false);
      if (needsAutoSaveRef.current) {
        needsAutoSaveRef.current = false;
        await executeAutoSave();
      }
    }
  };

  // Main auto-save effect with debouncing
  useEffect(() => {
    if (!isEditing) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
        autoSaveTimeoutRef.current = null;
      }
      setAutoSaveState('idle');
      setLastAutoSaveAt(null);
      return;
    }

    const normalized = normalizeFunction(currentData);
    if (!normalized) return;

    const snapshot = JSON.stringify(normalized);
    if (snapshot === lastSavedSnapshotRef.current) {
      if (autoSaveState !== 'saved') setAutoSaveState('saved');
      return;
    }

    if (!normalized.title) {
      setAutoSaveState('waiting');
      return;
    }

    if (isAutoSaving) {
      needsAutoSaveRef.current = true;
      setAutoSaveState('pending');
      return;
    }

    setAutoSaveState('pending');

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
      autoSaveTimeoutRef.current = null;
    }

    autoSaveTimeoutRef.current = window.setTimeout(async () => {
      await executeAutoSave();
    }, 1000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
        autoSaveTimeoutRef.current = null;
      }
    };
  }, [currentData, isEditing, isAutoSaving, normalizeFunction, autoSaveState, ...dependencies]);

  return {
    autoSaveState,
    lastAutoSaveAt,
    isAutoSaving,
    hasCreatedOnServer: hasCreatedOnServerRef.current,
    setHasCreatedOnServer: (value: boolean) => {
      hasCreatedOnServerRef.current = value;
    },
  };
}
