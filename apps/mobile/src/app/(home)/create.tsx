import { useRouter, router } from 'expo-router';
import { Button, StyleSheet, Text, View, Image, useWindowDimensions, Pressable, Alert } from "react-native";
import { useState } from 'react';

// components
import TitleText from '@/components/ui/TitleText';
import ComButton from '@/components/ui/ComButton';
import LoadingIsland from '@/components/ui/LoadingIsland';

// icons
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

// API
import { useCreateParty } from '@/api/queries';

export default function CreateScreen() {
  // React Query mutation hook
  const createPartyMutation = useCreateParty();

  const [partyName, setPartyName] = useState<string>('Sonic Youth');

  const handleCreateParty = async () => {
    const mockOrganizerId = 'cmwbfo5fx0001ydb60d11maix'; // Replace with real user ID
    try {
      const result = await createPartyMutation.mutateAsync({
        name: partyName,
        organizerId: mockOrganizerId,
        status: 'LIVE', // Optional
      });

      // Navigate to overview on success
      router.push({
        pathname: '/overview/[id]',
        params: { 
          id: result.party.id,
          partyName: result.party.name,
        }
      });
    } catch (error) {
      // Error handling
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to create party'
      );
    }
  }

  const goToPreview = () => {
    router.push({
      pathname: '/invite/[id]',
      params: { 
        id: '38dk3',
        isPreview: 'true'
       }
    })
  }

  return (
    <View style={styles.container}>
      {/* Name */}
      <View style={styles.formContainer}>
        <TitleText
          variant='h3'
        >
          Party Name:
        </TitleText>
        <TitleText
          variant='h1'
        >Party Name</TitleText>
      </View>

      {/* Poster (add photo) */}
      <TitleText
        variant='h3'
      >
        Poster:
      </TitleText>
      <Pressable 
        style={styles.addPosterContainer}
        onPress={() => alert('file system')}
      >
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <FontAwesome6 name="file-image" size={24} color="black" />
          <Text>
            add a poster
          </Text>
        </View>
      </Pressable>
      {/* <Image
        source={require('@/assets/images/currents.png')}
        resizeMode={'cover'}
        style={{
          // width: '50%',
          // height: '50%'
          width: screenWidth * .55,
          height: screenWidth * .8
        }}
      /> */}
      
      {/* Add operators */}
      <View style={styles.formContainer}>
        <TitleText
          variant='h3'
        >
          Lighting Operators:
        </TitleText>
        <TitleText
          variant='h1'
        >
          [          ]
        </TitleText>
      </View>

      <View style={styles.formContainer}>
        <ComButton
          text='CREATE NOW'
          textColor='black'
          textSizeVariant='h2'
          backgroundColor='#84FF32'
          onPress={handleCreateParty}
          disabled={createPartyMutation.isPending}
        />
        <ComButton
          text='PREVIEW INVITE'
          textColor='black'
          textSizeVariant='h3'
          backgroundColor='#FF87DF'
          onPress={goToPreview}
          disabled={createPartyMutation.isPending}
        />
        <ComButton
          text='start over'
          textColor='black'
          textSizeVariant='h3'
          hasContainer={false}
          onPress={() => alert('clear')}
          disabled={createPartyMutation.isPending}
        />
      </View>
      <LoadingIsland
        visible={createPartyMutation.isPending}
      />
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
    // width: '80%',
    marginVertical: 10,
  },
  addPosterContainer: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    width: '50%',
    maxWidth: 180,
    alignItems: 'flex-start',
  }
});
