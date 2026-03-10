import { Box, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { workers } from '@/constants/workers';

export default function WorkerList() {
    const safeAreaInsets = useSafeAreaInsets();
    const insets = {
        ...safeAreaInsets,
        bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
    };
    const theme = useTheme();

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
                    <ThemedText type="title">Workers</ThemedText>
                    <ThemedText style={styles.subtitle}>
            10 placeholder workers loaded into the schedule.
                    </ThemedText>
                    <View style={styles.nativeList}>
                        {workers.map((worker, index) => (
                            <View
                                key={worker.id}
                                style={[
                                    styles.nativeListItem,
                                    index < workers.length - 1 && styles.nativeListItemBorder,
                                ]}>
                                <ThemedText style={styles.workerName}>{worker.name}</ThemedText>
                                <ThemedText>{worker.email}</ThemedText>
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
    nativeList: {
        marginTop: Spacing.two,
        borderRadius: Spacing.three,
        overflow: 'hidden',
    },
    nativeListItem: {
        paddingVertical: Spacing.three,
    },
    nativeListItemBorder: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#CBD5E1',
    },
    workerName: {
        fontWeight: '600',
    },
});
