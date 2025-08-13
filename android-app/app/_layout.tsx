import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';
import { AuthProvider } from '@/context/authContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
      <StatusBar backgroundColor="white" barStyle={'dark-content'} />
    </AuthProvider>
  );
}
