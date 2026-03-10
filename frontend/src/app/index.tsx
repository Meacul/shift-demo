import React from 'react';
import { Alert, Button, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAppContext } from '@/context/app-context';
import { useTheme } from '@/hooks/use-theme';

import { convertShiftTimeToHumanReadable } from '@/constants/shifts';

export default function ShiftList() {
    const safeAreaInsets = useSafeAreaInsets();
    const insets = {
        ...safeAreaInsets,
        bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
    };
    const theme = useTheme();
    const {
        shifts,
        currentUser,
        currentUserId,
        claimShift,
        unclaimShift,
        getShiftOwner,
    } = useAppContext();

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

    return (
        <ScrollView
            style={[styles.scrollView, { backgroundColor: theme.background }]}
            contentInset={insets}
            contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
            <ThemedView style={styles.container}>
                <View style={styles.nativeCard}>
                    <ThemedText type="title">Shifts</ThemedText>
                    <ThemedText style={styles.subtitle}>
                        {currentUser ? `Current user: ${currentUser.name}` : 'Select a worker before claiming a shift.'}
                    </ThemedText>
                    <View style={styles.nativeList}>
                        {shifts.map((shift, index) => {
                            const owner = getShiftOwner(shift.id);
                            const isClaimedByCurrentUser = owner?.id === currentUserId;

                            return (
                                <View
                                    key={shift.id}
                                    style={[
                                        styles.nativeListItem,
                                        index < shifts.length - 1 && styles.nativeListItemBorder,
                                    ]}>
                                    <View>
                                        <ThemedText style={styles.workerName}>{shift.location.name}</ThemedText>
                                        <ThemedText>{convertShiftTimeToHumanReadable(shift.from)} to {convertShiftTimeToHumanReadable(shift.to)}</ThemedText>
                                        <ThemedText style={styles.claimedByText}>
                                            {owner ? `Claimed by ${owner.name}` : 'Unclaimed'}
                                        </ThemedText>
                                    </View>
                                    <Button
                                        title={isClaimedByCurrentUser ? 'Unclaim shift' : 'Claim shift'}
                                        onPress={() => {
                                            if (!currentUser) {
                                                Alert.alert('No current user', 'Select a worker before claiming a shift.');
                                                return;
                                            }

                                            if (isClaimedByCurrentUser) {
                                                unclaimShift(shift.id);
                                                return;
                                            }

                                            claimShift(shift.id);
                                        }}
                                    />
                                </View>
                            );
                        })}
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
    nativeList: {
        marginTop: Spacing.two,
        borderRadius: Spacing.three,
        overflow: 'hidden',
    },
    nativeListItem: {
        paddingVertical: Spacing.three,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nativeListItemBorder: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#CBD5E1',
    },
    workerName: {
        fontWeight: '600',
    },
    claimedByText: {
        opacity: 0.7,
    },
});
