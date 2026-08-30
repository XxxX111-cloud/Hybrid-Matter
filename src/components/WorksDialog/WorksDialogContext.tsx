import { createContext, useCallback, useContext, useState } from 'react';

export type WorkDialogKey = 'prepped-food-spring' | 'dt-business-video' | 'throat-civilization' | 'gfl-ar-dimension' | 'yi-tao' | null;

interface WorksDialogContextValue {
  openWork: WorkDialogKey;
  openDialog: (key: WorkDialogKey) => void;
  closeDialog: () => void;
}

const WorksDialogContext = createContext<WorksDialogContextValue | null>(null);

export function WorksDialogProvider({ children }: { children: React.ReactNode }) {
  const [openWork, setOpenWork] = useState<WorkDialogKey>(null);

  const openDialog = useCallback((key: WorkDialogKey) => {
    if (key) setOpenWork(key);
  }, []);

  const closeDialog = useCallback(() => {
    setOpenWork(null);
  }, []);

  return (
    <WorksDialogContext.Provider value={{ openWork, openDialog, closeDialog }}>
      {children}
    </WorksDialogContext.Provider>
  );
}

export function useWorksDialog() {
  const ctx = useContext(WorksDialogContext);
  if (!ctx) throw new Error('useWorksDialog must be used within WorksDialogProvider');
  return ctx;
}
