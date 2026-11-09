import { useRouter, useLocalSearchParams, router } from 'expo-router';
import { Button, StyleSheet, Text, View } from "react-native";

export default function PartyOrganizerViewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const goToBoard = () => {
    router.replace('/');
  }

  return (
    <View style={styles.container}>
      <Text>Party Organizer View {id}</Text>
      <Button
        title='Go back to Board'
        onPress={goToBoard}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
