import { useRouter, useLocalSearchParams, router } from 'expo-router';
import { StyleSheet, View, Image, useWindowDimensions } from "react-native";
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

// components
import TitleText from '@/components/ui/TitleText';
import ComButton from '@/components/ui/ComButton';

import OverlayContainer from '@/components/ui/OverlayContainer';
import ShareSection from '@/components/ui/ShareSection';

// api
import { useParty } from '@/api/queries';

export default function PartyOrganizerViewScreen() {
  const { id, partyName } = useLocalSearchParams<{ id: string; partyName?: string }>();
  const { width: screenWidth } = useWindowDimensions();

  const [showShare, setShowShare] = useState<boolean>(false);
  // TODO: Replace with actual userId from auth context
  const userId = 'cmwbfo5fx0001ydb60d11maix';

  // Fetch user parties with React Query
  const { 
    data, 
    isLoading, 
    error, 
    refetch,
    isRefetching 
  } = useParty(id);

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

  const handleCopyQR = () => {
    alert('handleCopyQR');
  }

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const partyData = data?.party;

  return (
    <View style={styles.container}>
      {/* Party Name */}
      <View style={styles.formContainer}>
        <TitleText variant='h3'>
          Party Name:
        </TitleText>
        <TitleText variant='h1'>
          {partyData?.name}
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
          onPress={() => setShowShare(true)}
        />
        <ComButton
          text='END PARTY'
          textColor='white'
          textSizeVariant='h2'
          backgroundColor='black'
          onPress={handleEndParty}
        />
        <ComButton
          text='go home'
          textColor='black'
          textSizeVariant='h3'
          hasContainer={false}
          onPress={goToBoard}
        />
      </View>

      {/* Share Overlay */}
      <OverlayContainer visible={showShare} containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
        <ShareSection
          joinCode={partyData?.joinCode || ''}
          onShare={handleShare}
        />
        <ComButton
          text='dismiss'
          textColor='white'
          textSizeVariant='h3'
          hasContainer={false}
          onPress={() => setShowShare(false)}
        />
      </OverlayContainer>
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
