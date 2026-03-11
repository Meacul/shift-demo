import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { Worker, workers as fallbackWorkers } from '@/constants/workers';
import { shifts } from '@/constants/shifts';
import { client } from '@/utils/apolloGraphQL';
import { GET_WORKERS } from '@/utils/queries';
import { GetWorkersQuery } from '@/generated/graphql';

type WorkerId = Worker['id'];

type AppContextValue = {
  workers: Worker[];
  shifts: typeof shifts;
  currentUserId: WorkerId | null;
  currentUser: Worker | null;
  claimedShifts: Record<string, WorkerId | null>;
  workersLoading: boolean;
  workersError: string | null;
  setCurrentUserId: (workerId: WorkerId | null) => void;
  claimShift: (shiftId: string) => void;
  unclaimShift: (shiftId: string) => void;
  getShiftOwner: (shiftId: string) => Worker | null;
  refreshWorkers: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [workers, setWorkers] = useState<Worker[]>(fallbackWorkers);
    const [workersLoading, setWorkersLoading] = useState(true);
    const [workersError, setWorkersError] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<WorkerId | null>(null);
    const [claimedShifts, setClaimedShifts] = useState<Record<string, WorkerId | null>>({});

    useEffect(() => {
        let cancelled = false;

        const loadWorkers = async () => {
            setWorkersLoading(true);
            setWorkersError(null);

            try {
                const { data } = await client.query({
                    query: GET_WORKERS,
                    fetchPolicy: 'network-only',
                });

                if (cancelled) {
                    return;
                }

                let workersData: Worker[] = [];
                if (data && data.workers) {
                    workersData = data.workers.map((worker: any) => ({
                        id: worker.id,
                        name: worker.name,
                        email: worker.email,
                    }));
                }

                setWorkers(workersData);
            } catch (error) {
                if (cancelled) {
                    return;
                }

                setWorkers(fallbackWorkers);
                setWorkersError(error instanceof Error ? error.message : 'Failed to load workers.');
            } finally {
                if (!cancelled) {
                    setWorkersLoading(false);
                }
            }
        };

        void loadWorkers();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!workers.length) {
            if (currentUserId !== null) {
                setCurrentUserId(null);
            }
            return;
        }

        const hasCurrentUser = currentUserId ? workers.some((worker) => worker.id === currentUserId) : false;
        if (!hasCurrentUser) {
            setCurrentUserId(workers[0].id);
        }
    }, [currentUserId, workers]);

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

    const refreshWorkers = async () => {
        setWorkersLoading(true);
        setWorkersError(null);

        try {
            const { data } = await client.query({
                query: GET_WORKERS,
                fetchPolicy: 'network-only',
            });

            setWorkers(data.workers);
        } catch (error) {
            setWorkersError(error instanceof Error ? error.message : 'Failed to load workers.');
            throw error;
        } finally {
            setWorkersLoading(false);
        }
    };

    const value = {
        workers,
        shifts,
        currentUserId,
        currentUser,
        claimedShifts,
        workersLoading,
        workersError,
        setCurrentUserId,
        claimShift,
        unclaimShift,
        getShiftOwner,
        refreshWorkers,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }

    return context;
}
