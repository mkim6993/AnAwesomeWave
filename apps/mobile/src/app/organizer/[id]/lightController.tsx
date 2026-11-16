import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useEffect } from 'react';

// hooks
import { usePartyWebSocket } from '@/hooks/useWebSocket';
import { useAuth } from '@/providers/AuthProvider';

// components
import TitleText from '@/components/ui/TitleText';
import ComButton from '@/components/ui/ComButton';
import EffectItem from '@/components/organizer/EffectItem';
import TwinklePreview from '@/components/organizer/effectPreviews/TwinklePreview';
import RainbowPreview from '@/components/organizer/effectPreviews/RainbowPreview';

const partyURL = process.env.EXPO_PUBLIC_WS_URL;

const LightController = () => {
  const { userId } = useAuth();
  const { id, partyName } = useLocalSearchParams<{ id: string, partyName: string }>();

  const {
    connect,
    disconnect,
    isConnected,
    sendMessage
  } = usePartyWebSocket(partyURL, id, userId)

  const goBack = () => {
    router.back();
  }

  const handleEffectPress = (group: string, name: string) => {
    console.log('Group:', group, 'Name:', name);
    sendMessage({
      type: 'broadcast',
      partyId: id,
      event: {
        group,
        name,
      }
    })
  }

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <ComButton
        text='< leave controller'
        textColor='black'
        textSizeVariant='h3'
        hasContainer={false}
        onPress={goBack}
      />

      {/* Title */}
      <View style={styles.formContainer}>
        <TitleText variant='h1'>
          Lighting Controller
        </TitleText>
        <TitleText variant='h3'>
          party: {partyName}
        </TitleText>
      </View>

      {/* Stop Button */}
      <View style={styles.formContainer}>
        <ComButton
          text='CLEAR'
          textColor='white'
          textSizeVariant='h2'
          backgroundColor='#FF0000'
          onPress={() => handleEffectPress('operator', 'clear')}
        />
      </View>

      {/* Scrollable Effects List */}
      <ScrollView style={styles.scrollContainer}>
        {/* Solid Colors Section */}
        <View style={styles.formContainer}>
          <TitleText variant='h3'>
            solid colors
          </TitleText>
          <View style={styles.effectsGrid}>
            <EffectItem
              label='#84FF32'
              solidColor='#84FF32'
              onPress={() => handleEffectPress('solid', '#84FF32')}
            />
            <EffectItem
              label='#FF87DF'
              solidColor='#FF87DF'
              onPress={() => handleEffectPress('solid', '#FF87DF')}
            />
            <EffectItem
              label='#2ffae2'
              solidColor='#2ffae2'
              onPress={() => handleEffectPress('solid', '#2ffae2')}
            />
            <EffectItem
              label='#ff3939'
              solidColor='#ff3939'
              onPress={() => handleEffectPress('solid', '#ff3939')}
            />
            <EffectItem
              label='#ffff62'
              solidColor='#ffff62'
              onPress={() => handleEffectPress('solid', '#ffff62')}
            />
            <EffectItem
              label='#9D00FF'
              solidColor='#9D00FF'
              onPress={() => handleEffectPress('solid', '#9D00FF')}
            />
          </View>
        </View>

        {/* Group Effects Section */}
        <View style={styles.formContainer}>
          <TitleText variant='h3'>
            group effects
          </TitleText>
          <View style={styles.effectsGrid}>
            <EffectItem
              label='Twinkle'
              solidColor='#FF6B6B'
              onPress={() => handleEffectPress('group', 'twinkle')}
            >
              <TwinklePreview />
            </EffectItem>
          </View>
        </View>

        {/* Individual Effects Section */}
        <View style={styles.formContainer}>
          <TitleText variant='h3'>
            individual effects
          </TitleText>
          <View style={styles.effectsGrid}>
            <EffectItem
              label='Rainbow'
              solidColor='#FFD93D'
              onPress={() => handleEffectPress('individual', 'rainbow')}
            >
              <RainbowPreview durationPerColor={50} />
            </EffectItem>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  formContainer: {
    marginVertical: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  effectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  }
});

export default LightController;