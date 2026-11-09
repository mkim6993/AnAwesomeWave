import { useRouter, router } from 'expo-router';
import { Button, StyleSheet, Text, View } from "react-native";

export default function BoardScreen() {

  const goToParty = (admin: boolean) => {
    router.push(`/${admin ? 'overview' : 'party'}/${'6I_id81e8D'}`)
  }

  const goToInvite = () => {
    router.push('/invite/6I_id81e8D')
  }

  return (
    <View style={styles.container}>
      <Text>This is the board</Text>
      <Button
        title='Go to party'
        onPress={() => goToParty(false)}
      />
      <Button
        title='Go to party organizer view'
        onPress={() => goToParty(true)}
      />
      <Button
        title='Go to invite'
        onPress={goToInvite}
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
