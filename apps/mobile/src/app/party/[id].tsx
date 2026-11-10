import { useRouter, useLocalSearchParams, router } from 'expo-router';
import { Button, StyleSheet, Text, View, Pressable } from "react-native";

// Components
import TitleText from '@/components/ui/TitleText';
import ComButton from '@/components/ui/ComButton';

export default function PartyScreen() {
  const {
    id,
    isPreview
  } = useLocalSearchParams<{ id: string; isPreview?: string }>();

  const goToBoard = () => {
    router.replace('/');
  }

  const returnToCreate = () => {
    router.canGoBack()
      && !isPreview
      ? router.back()
      : router.replace('/create');
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: 'gray',
          flex: 1,
          width: '100%',
        }}
      >
        {isPreview && (
          <View
            style={{
              position: 'absolute',
              left: 0,
            }}
          >
            <ComButton
              text='RETURN'
              textSizeVariant='h3'
              textColor='black'
              onPress={returnToCreate}
            />
          </View>
        )}
        {/* Top Right Button */}
        <View
          style={{
            width: '20%',
            marginLeft: 'auto',
            maxWidth: 100,
          }}
        >
          <Button
            title='Go back to Board'
            onPress={goToBoard}
          />
        </View>
      </View>

      {/* Bottom Overlay */}
      <View
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          width: '100%',
        }}
      >
        <TitleText
          variant='h1'
        >Party {id}</TitleText>
      </View>
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
