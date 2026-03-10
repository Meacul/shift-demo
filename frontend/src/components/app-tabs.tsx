import { NativeTabs } from 'expo-router/unstable-native-tabs';
import React, { useState } from 'react';
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';

import WorkerSelector from '@/components/worker-selector';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useAppContext } from '@/context/app-context';

export default function AppTabs() {
    const scheme = useColorScheme();
    const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];
    const { currentUser } = useAppContext();
    const [isWorkerSelectorOpen, setIsWorkerSelectorOpen] = useState(false);

    return (
        <View style={styles.container}>
            <Pressable
                onPress={() => setIsWorkerSelectorOpen(true)}
                style={[styles.workerButton, { backgroundColor: colors.backgroundElement }]}>
                <ThemedText>
                    {currentUser ? currentUser.name : 'Select worker'}
                </ThemedText>
            </Pressable>
            <NativeTabs
                backgroundColor={colors.background}
                indicatorColor={colors.backgroundElement}
                labelStyle={{ selected: { color: colors.text } }}>
                <NativeTabs.Trigger name="shifts">
                    <NativeTabs.Trigger.Label>Shift list</NativeTabs.Trigger.Label>
                    <NativeTabs.Trigger.Icon
                        src={require('@/assets/images/tabIcons/home.png')}
                        renderingMode="template"
                    />
                </NativeTabs.Trigger>

                <NativeTabs.Trigger name="workers">
                    <NativeTabs.Trigger.Label>Worker list</NativeTabs.Trigger.Label>
                    <NativeTabs.Trigger.Icon
                        src={require('@/assets/images/tabIcons/explore.png')}
                        renderingMode="template"
                    />
                </NativeTabs.Trigger>
            </NativeTabs>
            <WorkerSelector
                visible={isWorkerSelectorOpen}
                onClose={() => setIsWorkerSelectorOpen(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    workerButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
});
