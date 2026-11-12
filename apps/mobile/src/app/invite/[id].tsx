import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Image, useWindowDimensions } from "react-native";
import { useState } from 'react';

// queries
import { useJoinParty } from '@/api/queries';

// components
import TitleText from '@/components/ui/TitleText';
import ComButton from '@/components/ui/ComButton';

import LoadingIsland from '@/components/ui/LoadingIsland';

// sample @TODO test delete this
const userId = 'cmwcrr2nr0000vcb6yr1ds4f2';

export default function InviteScreen() {
  const {
    id,
    partyName,
    isPreview,
    fromCode
  } = useLocalSearchParams<{
    id: string,
    partyName?: string,
    isPreview?: string,
    fromCode?: string,
  }>();
  const joinPartyMutation = useJoinParty();
  const { width: screenWidth } = useWindowDimensions();
  const previewMode = isPreview === 'true';
  const showDecline = fromCode !== 'true';

  const handleAccept = async () => {
    try {
      const result = await joinPartyMutation.mutateAsync({
        partyId: id,
        userId: userId,
      });
      if (result.success) {
        router.replace({
          pathname: '/party/[id]',
          params: {
            id: result.party.id,
          }
        })
      }
    } catch (error) {
      
    }
  }

  const handleDecline = () => {
    router.replace('/');
  }

  const handleNotNow = () => {
    router.back();
  }

  const returnToCreate = () => {
    router.canGoBack()
      && previewMode
      ? router.back()
      : router.replace('/create');
  }

  return (
    <View style={styles.container}>
      <View style={styles.loadingIslandContainer}>
        <LoadingIsland visible={joinPartyMutation.isPending} />
      </View>
      {previewMode && (
        <View
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
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
            disabled={previewMode || joinPartyMutation.isPending}
          />
          {showDecline && (
            <ComButton
              text='DECLINE'
              textColor='black'
              textSizeVariant='h2'
              backgroundColor='#FF87DF'
              onPress={handleDecline}
              disabled={previewMode || joinPartyMutation.isPending}
            />
          )}
          <ComButton
            text='not now'
            textColor='black'
            textSizeVariant='h3'
            hasContainer={false}
            onPress={handleNotNow}
            disabled={previewMode}
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
  },
  loadingIslandContainer: {
    // backgroundColor: 'green',
    flex: 1,
    position: 'absolute',
    zIndex: 1
  }
});
