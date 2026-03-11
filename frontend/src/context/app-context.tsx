import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { Worker, workers as fallbackWorkers } from '@/constants/workers';
import { Shift } from '@/constants/shifts';
import { client } from '@/utils/apolloGraphQL';
import { GET_SHIFTS, GET_WORKERS } from '@/utils/queries';
import { GetWorkersQuery, GetShiftsQuery, RequestShiftMutation, RemoveShiftRequestMutation } from '@/generated/graphql';
import { REMOVE_SHIFT_REQUEST, REQUEST_SHIFT } from '@/utils/mutations';

type WorkerId = Worker['id'];

type AppContextValue = {
    workers: Worker[];
    shifts: Shift[];
    currentUserId: WorkerId | null;
    currentUser: Worker | null;
    claimedShifts: Record<string, WorkerId | null>;
    workersLoading: boolean;
    workersError: string | null;
    shiftsLoading: boolean;
    shiftsError: string | null;
    loadWorkers: () => Promise<void>;
    loadShifts: () => Promise<void>;
    setCurrentUserId: (workerId: WorkerId | null) => void;
    claimShift: (shiftId: string) => Promise<void>;
    unclaimShift: (shiftId: string) => Promise<void>;
    getShiftOwner: (shiftId: string) => Worker | null;
    refreshData: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [workersLoading, setWorkersLoading] = useState(true);
    const [workersError, setWorkersError] = useState<string | null>(null);
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [shiftsLoading, setShiftsLoading] = useState(true);
    const [shiftsError, setShiftsError] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<WorkerId | null>(null);
    const [claimedShifts, setClaimedShifts] = useState<Record<string, WorkerId | null>>({});

    const loadWorkers = async () => {
        setWorkersLoading(true);
        setWorkersError(null);

        try {
            const { data } = await client.query<GetWorkersQuery>({
                query: GET_WORKERS,
                fetchPolicy: 'network-only',
            });

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
            setWorkersError(error instanceof Error ? error.message : 'Failed to load workers.');
        } finally {
            setWorkersLoading(false);
        }
    };

    const loadShifts = async () => {
        setShiftsLoading(true);
        setShiftsError(null);

        try {
            const { data } = await client.query<GetShiftsQuery>({
                query: GET_SHIFTS,
                fetchPolicy: 'network-only',
            });

            let shiftData: Shift[] = [];
            if (data && data.shifts) {
                shiftData = data.shifts;
            }
            setShifts(shiftData);
        } catch (error) {

            setShiftsError(error instanceof Error ? error.message : 'Failed to load shifts.');
        } finally {
            setShiftsLoading(false);
        }
    };

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

    useEffect(() => {
        let cancelled = false;

        const loadShifts = async () => {
            setShiftsLoading(true);
            setShiftsError(null);

            try {
                const { data } = await client.query<GetShiftsQuery>({
                    query: GET_SHIFTS,
                    fetchPolicy: 'network-only',
                });

                if (cancelled) {
                    return;
                }

                let shiftData: Shift[] = [];
                if (data && data.shifts) {
                    shiftData = data.shifts;
                }
                console.log('Loaded shifts:', shiftData);
                setShifts(shiftData);
            } catch (error) {
                if (cancelled) {
                    return;
                }

                setShiftsError(error instanceof Error ? error.message : 'Failed to load shifts.');
            } finally {
                if (!cancelled) {
                    setShiftsLoading(false);
                }
            }
        };

        void loadShifts();

        return () => {
            cancelled = true;
        };
    }, []);



    const currentUser = currentUserId
        ? workers.find((worker) => worker.id === currentUserId) ?? null
        : null;

    const claimShift = async (shiftId: string) => {
        if (!currentUserId) {
            return;
        }

        const { data } = await client.mutate<RequestShiftMutation>({
            mutation: REQUEST_SHIFT,
            variables: { workerId: currentUserId, shiftId },
            fetchPolicy: 'network-only',
        });

        await refreshData();
    };

    const unclaimShift = async (shiftId: string) => {
        if (!currentUserId) {
            return;
        }

        const { data } = await client.mutate<RemoveShiftRequestMutation>({
            mutation: REMOVE_SHIFT_REQUEST,
            variables: { workerId: currentUserId, shiftId },
            fetchPolicy: 'network-only',
        });
        
        await refreshData();
    };

    const getShiftOwner = (shiftId: string) => {
        const shift = shifts.find((s) => s.id === shiftId);
        if (!shift) {
            return null;
        }

        if (!shift.shiftRequests || shift.shiftRequests.length === 0) {
            return null;
        } else {
            const workerId = shift.shiftRequests[0].worker.id;
            return workers.find((worker) => worker.id === workerId) || null;
        }
    };

    const refreshData = async () => {
        await Promise.allSettled([loadShifts(), loadWorkers()]);
    };

    const value = {
        workers,
        shifts,
        currentUserId,
        currentUser,
        claimedShifts,
        workersLoading,
        workersError,
        shiftsLoading,
        shiftsError,
        loadWorkers,
        loadShifts,
        setCurrentUserId,
        claimShift,
        unclaimShift,
        getShiftOwner,
        refreshData,
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
