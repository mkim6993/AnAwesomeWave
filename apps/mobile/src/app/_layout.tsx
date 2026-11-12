import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <QueryProvider>
        <Stack 
          screenOptions={{
            headerShown: false
          }}
        >
          {/* Tab group - the main app experience */}
          <Stack.Screen
            name="(home)"
            options={{ headerShown: false }}
          />

          {/* Modal-style screens that overlay tabs */}
          <Stack.Screen
            name="party/[id]"
            options={{
              presentation: 'card', // or 'modal' for slide-up effect
              title: 'Party',
            }}
          />

          <Stack.Screen
            name="invite/[id]"
            options={{
              presentation: 'card',
              title: 'Invite',
            }}
          />

          <Stack.Screen
            name="overview/[id]"
            options={{
              presentation: 'card',
              title: 'Overview',
            }}
          />
        </Stack>
      </QueryProvider>
    </AuthProvider>
  );
}
