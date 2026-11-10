import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Image, useWindowDimensions } from "react-native";

// components
import TitleText from '@/components/ui/TitleText';
import ComButton from '@/components/ui/ComButton';

export default function InviteScreen() {
  const { id, partyName } = useLocalSearchParams<{ id: string; partyName?: string }>();
  const { width: screenWidth } = useWindowDimensions();

  const handleAccept = () => {
    // Navigate to party
    router.push({
      pathname: '/party/[id]',
      params: { id }
    });
  }

  const handleDecline = () => {
    router.replace('/');
  }

  const handleNotNow = () => {
    router.replace('/');
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Party Name */}
        <View style={styles.formContainer}>
          <TitleText variant='h1'>
            {partyName || 'Party Name'}
          </TitleText>
        </View>

        {/* Poster */}
        <Image
          source={require('@/assets/images/currents.png')}
          resizeMode={'cover'}
          style={{
            width: screenWidth * .7,
            height: screenWidth * 1.0
          }}
        />

        {/* Buttons */}
        <View style={styles.formContainer}>
          <ComButton
            text='ACCEPT'
            textColor='black'
            textSizeVariant='h2'
            backgroundColor='#84FF32'
            onPress={handleAccept}
          />
          <ComButton
            text='DECLINE'
            textColor='black'
            textSizeVariant='h2'
            backgroundColor='#FF87DF'
            onPress={handleDecline}
          />
          <ComButton
            text='not now'
            textColor='black'
            textSizeVariant='h3'
            hasContainer={false}
            onPress={handleNotNow}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 40,
    paddingHorizontal: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: '95%',
  },
  formContainer: {
    marginVertical: 15,
    alignItems: 'center',
  }
});
