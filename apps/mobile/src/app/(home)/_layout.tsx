import { Platform } from 'react-native';
import { NativeTabs } from 'expo-router/native-tabs';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  // Use Liquid Glass Tabs on native, regular Tabs on web
  if (Platform.OS === 'web') {
    return (
      <Tabs
        // screenOptions={{
        //   headerShown: false,
        // }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Board',
            tabBarIcon: ({ color }) => <span>🏠</span>,
          }}
        />
        <Tabs.Screen
          name='join'
          options={{
            title: 'Join',
            tabBarIcon: ({ color }) => <span>👥</span>,
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: 'Create',
            tabBarIcon: ({ color }) => <span>➕</span>,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <span>👤</span>,
          }}
        />
      </Tabs>
    );
  }

  // Native: Liquid Glass Tabs
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon 
          sf={{ default: 'square.grid.2x2', selected: 'square.grid.2x2.fill' }} 
          md="grid_view"
        />
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="create">
        <NativeTabs.Trigger.Icon 
          sf={{ default: 'plus.circle', selected: 'plus.circle.fill' }} 
          md="add_circle"
        />
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon 
          sf={{ default: 'person.circle', selected: 'person.circle.fill' }} 
          md="account_circle"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}