import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

import { workers } from '@/constants/workers';
import { shifts } from '@/constants/shifts';

type WorkerId = (typeof workers)[number]['id'];

type AppContextValue = {
  workers: typeof workers;
  shifts: typeof shifts;
  currentUserId: WorkerId | null;
  currentUser: (typeof workers)[number] | null;
  claimedShifts: Record<string, WorkerId | null>;
  setCurrentUserId: (workerId: WorkerId | null) => void;
  claimShift: (shiftId: string) => void;
  unclaimShift: (shiftId: string) => void;
  getShiftOwner: (shiftId: string) => (typeof workers)[number] | null;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState<WorkerId | null>(workers[0]?.id ?? null);
  const [claimedShifts, setClaimedShifts] = useState<Record<string, WorkerId | null>>({});

  const currentUser = currentUserId
    ? workers.find((worker) => worker.id === currentUserId) ?? null
    : null;

  const claimShift = (shiftId: string) => {
    if (!currentUserId) {
      return;
    }

    setClaimedShifts((previous) => ({
      ...previous,
      [shiftId]: currentUserId,
    }));
  };

  const unclaimShift = (shiftId: string) => {
    setClaimedShifts((previous) => ({
      ...previous,
      [shiftId]: null,
    }));
  };

  const getShiftOwner = (shiftId: string) => {
    const ownerId = claimedShifts[shiftId];
    return ownerId ? workers.find((worker) => worker.id === ownerId) ?? null : null;
  };

  const value = useMemo(
    () => ({
      workers,
      shifts,
      currentUserId,
      currentUser,
      claimedShifts,
      setCurrentUserId,
      claimShift,
      unclaimShift,
      getShiftOwner,
    }),
    [claimedShifts, currentUser, currentUserId]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
}
