import { useRouter, useLocalSearchParams, router } from 'expo-router';
import { StyleSheet, View, Image, useWindowDimensions } from "react-native";

// components
import TitleText from '@/components/ui/TitleText';
import ComButton from '@/components/ui/ComButton';

export default function PartyOrganizerViewScreen() {
  const { id, partyName } = useLocalSearchParams<{ id: string; partyName?: string }>();
  const { width: screenWidth } = useWindowDimensions();

  const goToControlBoard = () => {
    // TODO: Navigate to control board
    alert('Navigate to Control Board');
  }

  const handleShare = () => {
    // TODO: Implement share functionality
    alert('Share Party');
  }

  const handleEndParty = () => {
    // TODO: Implement end party functionality
    alert('End Party');
  }

  const goToBoard = () => {
    router.replace('/')
  }

  return (
    <View style={styles.container}>
      {/* Party Name */}
      <View style={styles.formContainer}>
        <TitleText variant='h3'>
          Party Name:
        </TitleText>
        <TitleText variant='h1'>
          {partyName || 'Party Name'}
        </TitleText>
      </View>

      {/* Image */}
      <TitleText variant='h3'>
        Poster:
      </TitleText>
      <Image
        source={require('@/assets/images/currents.png')}
        resizeMode={'cover'}
        style={{
          width: screenWidth * .55,
          height: screenWidth * .8
        }}
      />

      {/* Buttons */}
      <View style={styles.formContainer}>
        <ComButton
          text='OPERATE LIGHTS'
          textColor='black'
          textSizeVariant='h2'
          backgroundColor='#84FF32'
          onPress={goToControlBoard}
        />
        <ComButton
          text='SHARE INVITE'
          textColor='black'
          textSizeVariant='h2'
          backgroundColor='#FF87DF'
          onPress={handleShare}
        />
        <ComButton
          text='END PARTY'
          textColor='white'
          textSizeVariant='h2'
          backgroundColor='black'
          onPress={handleEndParty}
        />
        <ComButton
          text='GO HOME'
          textColor='black'
          textSizeVariant='h3'
          hasContainer={false}
          onPress={goToBoard}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 10,
  },
  formContainer: {
    marginVertical: 10,
  }
});
