import { router } from 'expo-router';
import { StyleSheet, View, TextInput, Pressable } from "react-native";
import { useState } from 'react';

// libraries
import * as Clipboard from 'expo-clipboard';

// queries
import { usePartyByJoinCode } from '@/api/queries';

// components
import TitleText from '@/components/ui/TitleText';
import ComButton from '@/components/ui/ComButton';
import PartyItem from '@/components/board/PartyItem';
import LoadingIsland from '@/components/ui/LoadingIsland';

// icons
import { FontAwesome6 } from '@expo/vector-icons';

// constants
const placeholderColor = 'rgba(122, 122, 122, 0.6)';

export default function JoinScreen() {
  const [joinCode, setJoinCode] = useState<string>('');
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);

  // Fetch only when manually triggered (enabled: false by default)
  const { data, isLoading, error, refetch } = usePartyByJoinCode(joinCode, false);

  const handlePaste = async () => {
    const stringToPaste = await Clipboard.getStringAsync();
    setJoinCode(stringToPaste);
    setSearchPerformed(false); // Reset search state when pasting
  };

  const handleCodeChange = (text: string) => {
    setJoinCode(text);
    setSearchPerformed(false); // Reset search state when user types
  };

  const handleSearch = () => {
    if (joinCode.length === 6) {
      setSearchPerformed(true);
      refetch(); // Manually trigger the fetch
    }
  };

  const handleViewInvite = () => {
    if (data?.party) {
      router.push({
        pathname: '/invite/[id]',
        params: { 
          id: data.party.id,
          partyName: data.party.name,
          fromCode: 'true',
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Section - Join Code Input with Paste and Search buttons */}
      <View style={styles.formContainer}>
        <TitleText variant='h3'>
          Join Code:
        </TitleText>
        <View style={styles.inputRow}>
          <TextInput
            placeholder='enter join code'
            placeholderTextColor={placeholderColor}
            style={styles.textInput}
            value={joinCode}
            onChangeText={handleCodeChange}
            autoCapitalize='none'
            maxLength={6}
          />
          <View style={styles.buttonGroup}>
            <Pressable
              onPress={handleSearch}
              style={styles.iconButton}
            >
              <FontAwesome6 name="magnifying-glass" size={20} color="white" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Middle Section - Party Display or Not Found */}
      {searchPerformed && (
        <View style={styles.partyDisplayContainer}>
          {isLoading ? (
            <View style={styles.searchVisualContainer}>
              <LoadingIsland visible={true} />
              <TitleText variant='h3'><samp></samp>searching...</TitleText>
            </View>
          ) : error ? (
            <View style={styles.notFoundContainer}>
              <TitleText variant='h1'>
                Party Not Found
              </TitleText>
              <TitleText variant='h3'>
                Check the code and try again
              </TitleText>
            </View>
          ) : data?.party ? (
            <>
              <PartyItem
                title={data.party.name}
                message={data.party.joinCode}
                backgroundColor='#84FF32'
                sampleImageIndex={0}
                onPress={handleViewInvite}
              />
              <View style={styles.formContainer}>
                <ComButton
                  text='VIEW'
                  textColor='black'
                  textSizeVariant='h2'
                  backgroundColor='#84FF32'
                  onPress={handleViewInvite}
                />
              </View>
            </>
          ) : null}
        </View>
      )}
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
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    maxWidth: 230,
  },
  buttonGroup: {
    flex: 1,
    flexDirection: 'row',
    gap: 3,
  },
  iconButton: {
    minWidth: 50,
    paddingHorizontal: 12,
    backgroundColor: 'black',
    borderRadius: 10,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 2,
  },
  partyDisplayContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  notFoundContainer: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  searchVisualContainer: {
    width: '100%',
    height: 160,
    // backgroundColor: 'teal',
    justifyContent: 'flex-end',
    alignItems: 'center',
  }
});
