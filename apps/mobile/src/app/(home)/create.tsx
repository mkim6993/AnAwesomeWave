import { useRouter, router } from 'expo-router';
import { Button, StyleSheet, Text, View } from "react-native";

export default function CreateScreen() {

  const goToOverview = () => {
    router.push('/overview/8329kc')
  }

  return (
    <View style={styles.container}>
      <Text>This is the create</Text>
      <Button
        title='Create!'
        onPress={goToOverview}
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
