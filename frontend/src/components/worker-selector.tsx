import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useAppContext } from '@/context/app-context';

type WorkerSelectorProps = {
    visible: boolean;
    onClose: () => void;
};

export default function WorkerSelector({ visible, onClose }: WorkerSelectorProps) {
    const { workers, currentUserId, setCurrentUserId } = useAppContext();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}>
            <View style={styles.overlay}>
                <Pressable style={styles.backdrop} onPress={onClose} />
                <ThemedView type="backgroundElement" style={styles.modalCard}>
                    <View style={styles.header}>
                        <ThemedText type="subtitle">Select worker</ThemedText>
                        <Pressable onPress={onClose}>
                            <ThemedText type="link">Close</ThemedText>
                        </Pressable>
                    </View>
                    <ScrollView contentContainerStyle={styles.list}>
                        {workers.map((worker) => (
                            <Pressable
                                key={worker.id}
                                onPress={() => {
                                    setCurrentUserId(worker.id);
                                    onClose();
                                }}
                                style={[
                                    styles.listItem,
                                    worker.id === currentUserId && styles.selectedListItem,
                                ]}>
                                <ThemedText style={styles.workerName}>{worker.name}</ThemedText>
                                <ThemedText type="small">{worker.email}</ThemedText>
                            </Pressable>
                        ))}
                    </ScrollView>
                </ThemedView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.four,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
    },
    modalCard: {
        width: '100%',
        maxWidth: 520,
        maxHeight: '80%',
        borderRadius: Spacing.four,
        padding: Spacing.four,
        gap: Spacing.three,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    list: {
        gap: Spacing.two,
    },
    listItem: {
        borderRadius: Spacing.three,
        paddingHorizontal: Spacing.three,
        paddingVertical: Spacing.three,
        gap: Spacing.one,
    },
    selectedListItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    workerName: {
        fontWeight: '600',
    },
});
