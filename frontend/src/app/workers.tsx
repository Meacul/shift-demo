import { Box, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type User = {
  name: string
  email: string
  id: string
}

const users: User[] = [
  { id: 'user-001', name: 'Ava Thompson', email: 'ava.thompson@example.com' },
  { id: 'user-002', name: 'Liam Carter', email: 'liam.carter@example.com' },
  { id: 'user-003', name: 'Sophia Nguyen', email: 'sophia.nguyen@example.com' },
  { id: 'user-004', name: 'Noah Patel', email: 'noah.patel@example.com' },
  { id: 'user-005', name: 'Isabella Martinez', email: 'isabella.martinez@example.com' },
  { id: 'user-006', name: 'Ethan Brooks', email: 'ethan.brooks@example.com' },
  { id: 'user-007', name: 'Mia Robinson', email: 'mia.robinson@example.com' },
  { id: 'user-008', name: 'Lucas Kim', email: 'lucas.kim@example.com' },
  { id: 'user-009', name: 'Charlotte Adams', email: 'charlotte.adams@example.com' },
  { id: 'user-010', name: 'James Walker', email: 'james.walker@example.com' },
];

export default function TabTwoScreen() {
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
            10 placeholder users loaded into the schedule.
          </ThemedText>
          <View style={styles.nativeList}>
            {users.map((user, index) => (
              <View
                key={user.id}
                style={[
                  styles.nativeListItem,
                  index < users.length - 1 && styles.nativeListItemBorder,
                ]}>
                <ThemedText style={styles.userName}>{user.name}</ThemedText>
                <ThemedText>{user.email}</ThemedText>
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
  userName: {
    fontWeight: '600',
  },
});
