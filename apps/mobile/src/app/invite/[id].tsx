import { useRouter, useLocalSearchParams, router } from 'expo-router';
import { Button, StyleSheet, Text, View } from "react-native";

export default function InviteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const goToBoard = () => {
    router.replace('/');
  }

  return (
    <View style={styles.container}>
      <Text>Invite {id}</Text>
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
