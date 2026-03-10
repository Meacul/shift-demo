import {
    Tabs,
    TabList,
    TabTrigger,
    TabSlot,
    TabTriggerSlotProps,
    TabListProps,
} from 'expo-router/ui';
import React, { useState } from 'react';
import { Pressable, useColorScheme, View, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import WorkerSelector from './worker-selector';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAppContext } from '@/context/app-context';

export default function AppTabs() {
    const [isWorkerSelectorOpen, setIsWorkerSelectorOpen] = useState(false);

    return (
        <Tabs>
            <TabSlot style={{ height: '100%' }} />
            <TabList asChild>
                <CustomTabList onOpenWorkerSelector={() => setIsWorkerSelectorOpen(true)}>
                    <TabTrigger name="shifts" href="/" asChild>
                        <TabButton>Shift list</TabButton>
                    </TabTrigger>
                    <TabTrigger name="workers" href="/workers" asChild>
                        <TabButton>Worker list</TabButton>
                    </TabTrigger>
                </CustomTabList>
            </TabList>
            <WorkerSelector
                visible={isWorkerSelectorOpen}
                onClose={() => setIsWorkerSelectorOpen(false)}
            />
        </Tabs>
    );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
    return (
        <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
            <ThemedView
                type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
                style={styles.tabButtonView}>
                <ThemedText type="small" themeColor={isFocused ? 'text' : 'textSecondary'}>
                    {children}
                </ThemedText>
            </ThemedView>
        </Pressable>
    );
}

export function CustomTabList(
    props: TabListProps & { onOpenWorkerSelector: () => void }
) {
    const scheme = useColorScheme();
    const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];
    const { currentUser } = useAppContext();

    return (
        <View {...props} style={styles.tabListContainer}>
            <ThemedView type="backgroundElement" style={styles.innerContainer}>
                <ThemedText type="smallBold" style={styles.brandText}>
          Scheduling demo
                </ThemedText>

                {props.children}
                <Pressable onPress={props.onOpenWorkerSelector} style={({ pressed }) => pressed && styles.pressed}>
                    <ThemedView type="backgroundSelected" style={styles.selectorButton}>
                        <ThemedText type="smallBold">
                            {currentUser ? currentUser.name : 'Select worker'}
                        </ThemedText>
                    </ThemedView>
                </Pressable>
            </ThemedView>
        </View>
    );
}

const styles = StyleSheet.create({
    tabListContainer: {
        position: 'absolute',
        width: '100%',
        padding: Spacing.three,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    innerContainer: {
        paddingVertical: Spacing.two,
        paddingHorizontal: Spacing.five,
        borderRadius: Spacing.five,
        flexDirection: 'row',
        alignItems: 'center',
        flexGrow: 1,
        gap: Spacing.two,
        maxWidth: MaxContentWidth,
    },
    brandText: {
        marginRight: 'auto',
    },
    pressed: {
        opacity: 0.7,
    },
    tabButtonView: {
        paddingVertical: Spacing.one,
        paddingHorizontal: Spacing.three,
        borderRadius: Spacing.three,
    },
    selectorButton: {
        paddingVertical: Spacing.one,
        paddingHorizontal: Spacing.three,
        borderRadius: Spacing.three,
    },
});
