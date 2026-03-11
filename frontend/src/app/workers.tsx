import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAppContext } from '@/context/app-context';
import { useTheme } from '@/hooks/use-theme';
import { ShiftDisplayData } from '@/constants/shifts';

export default function WorkerList() {
    const safeAreaInsets = useSafeAreaInsets();
    const insets = {
        ...safeAreaInsets,
        bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
    };
    const theme = useTheme();
    const { workers, workersLoading, workersError, shifts, getShiftOwner, loadWorkers, loadShifts } = useAppContext();

    const contentPlatformStyle = Platform.select({
        android: {
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            paddingBottom: insets.bottom,
        },
        web: {
            paddingTop: Spacing.six,
            paddingBottom: Spacing.four,
        },
    });

    useEffect(() => {
        loadWorkers();
    }, []);

    useEffect(() => {
        loadShifts();
    }, []);

    const [shiftsByWorker, setShiftsByWorker] = useState<Record<string, ShiftDisplayData[]>>({});
    useEffect(() => {
        // Parse shifts by worker for easier display
        const mapping: Record<string, ShiftDisplayData[]> = {};
        shifts.forEach(shift => {
            shift.shiftRequests.forEach(request => {
                const workerId = request.worker.id;
                if (!mapping[workerId]) {
                    mapping[workerId] = [];
                }
                mapping[workerId].push({
                    id: shift.id,
                    timeString: `${shift.startDate} ${shift.startTime} (${shift.durationInMinutes} mins)`,
                    locationName: shift.location.name,
                });
            });
        });
        setShiftsByWorker(mapping);
    }, [workers, shifts]);

    return (
        <ScrollView
            style={[styles.scrollView, { backgroundColor: theme.background }]}
            contentInset={insets}
            contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
            <ThemedView style={styles.container}>
                <View style={styles.nativeCard}>
                    <ThemedText type="title">Workers</ThemedText>
                    <ThemedText style={styles.subtitle}>
                        Worker directory. This screen can later show claimed shifts per worker.
                    </ThemedText>
                    {workersLoading ? (
                        <ThemedText type="small">Loading workers...</ThemedText>
                    ) : null}
                    {workersError ? (
                        <ThemedText type="small" style={styles.errorText}>
                            Using fallback worker data: {workersError}
                        </ThemedText>
                    ) : null}
                    <View style={styles.nativeList}>
                        {workers.map((worker, index) => (
                            <View
                                key={worker.id}
                                style={[
                                    styles.nativeListItem,
                                    index < workers.length - 1 && styles.nativeListItemBorder,
                                ]}>
                                <ThemedText style={styles.workerName}>{worker.name}</ThemedText>
                                <ThemedText>
                                    {worker.email}
                                </ThemedText>
                                {
                                    shiftsByWorker[worker.id] && shiftsByWorker[worker.id].length > 0 ?
                                        shiftsByWorker[worker.id].map((shift) => (
                                            <ThemedText key={shift.id} type="small">
                                                {`${shift.locationName}: ${shift.timeString}`}
                                            </ThemedText>
                                        )) :
                                        <ThemedText type="small" style={{ fontStyle: 'italic' }}>
                                        No claimed shifts
                                        </ThemedText>
                                }
                            </View>
                        ))}
                    </View>
                </View>
            </ThemedView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    container: {
        maxWidth: MaxContentWidth,
        flexGrow: 1,
    },
    nativeCard: {
        marginHorizontal: Spacing.four,
        marginTop: Spacing.four,
        borderRadius: Spacing.four,
        padding: Spacing.four,
        gap: Spacing.two,
    },
    subtitle: {
        opacity: 0.7,
    },
    errorText: {
        color: '#B91C1C',
    },
    nativeList: {
        marginTop: Spacing.two,
        borderRadius: Spacing.three,
        overflow: 'hidden',
    },
    nativeListItem: {
        paddingVertical: Spacing.three,
        paddingHorizontal: Spacing.three,
    },
    nativeListItemBorder: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#CBD5E1',
    },
    workerName: {
        fontWeight: '600',
    },
    shift: {

    }
});
