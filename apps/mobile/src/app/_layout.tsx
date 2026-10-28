import { QueryProvider } from "@/providers/QueryProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <QueryProvider>
      <Stack 
        screenOptions={{
          headerStyle: {
            backgroundColor: "#f472b6",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
          <Stack.Screen name="index" options={{ title: 'Home' }} />
          <Stack.Screen name="party" options={{ title: 'Party' }} />
          <Stack.Screen name='operator' options={{ title: 'Operator'}}  />
        </Stack>
    </QueryProvider>
  );
}
