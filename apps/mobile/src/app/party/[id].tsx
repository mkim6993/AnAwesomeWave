import { useRouter, useLocalSearchParams, router } from 'expo-router';
import { StyleSheet, View, Pressable } from "react-native";
import { useState } from 'react';
import { Feather, FontAwesome6 } from '@expo/vector-icons';

// Components
import TitleText from '@/components/ui/TitleText';
import ComButton from '@/components/ui/ComButton';

export default function PartyScreen() {
  const {
    id,
    isPreview
  } = useLocalSearchParams<{ id: string; isPreview?: string }>();

  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('COPY');
  const [copyTimeout, setCopyTimeout] = useState<NodeJS.Timeout | null>(null);

  const goToBoard = () => {
    router.replace('/');
  }

  const returnToCreate = () => {
    router.canGoBack()
      && !isPreview
      ? router.back()
      : router.replace('/create');
  }

  const handleSettings = () => {
    if (!isLocked) {
      setShowSettings(true);
    }
  }

  const togglePlayPause = () => {
    if (!isLocked) {
      setIsPlaying(!isPlaying);
    }
  }

  const handleShare = () => {
    // TODO: Implement share functionality
    alert('Share Party');
  }

  const handleLeaveParty = () => {
    setShowSettings(false);
    goToBoard();
  }

  const handleCopyQR = () => {
    // Clear any existing timeout to handle spam
    if (copyTimeout) {
      clearTimeout(copyTimeout);
    }

    // TODO: Implement copy QR code
    setCopyButtonText('COPIED!');
    
    // Reset text after 2 seconds
    const timeout = setTimeout(() => {
      setCopyButtonText('COPY');
    }, 2000);
    
    setCopyTimeout(timeout);
  }

  const dismissSettings = () => {
    setShowSettings(false);
  }

  const handleLockPress = () => {
    setIsLocked(!isLocked);
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: 'gray',
          flex: 1,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isPreview && (
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
        
        {/* Top Center Lock Button */}
        <View style={[styles.lockButton]}>
          <Pressable
            onLongPress={handleLockPress}
            delayLongPress={500}
            style={styles.lockButtonInner}
          >
            <FontAwesome6 
              name={isLocked ? "lock" : "lock-open"} 
              size={24} 
              color={isLocked ? 'white' : 'gray'}
            />
            <TitleText variant='h3' color={isLocked ? 'white' : 'gray'}>
              {isLocked ? "hold to unlock" : "hold to lock"}
            </TitleText>
          </Pressable>
        </View>

        {/* Center Play/Pause Button */}
        <Pressable
          style={styles.playPauseButton}
          onPress={togglePlayPause}
          disabled={isLocked}
        >
          <FontAwesome6 
            name={isPlaying ? "pause" : "play"} 
            size={55} 
            color={isLocked ? '#666' : 'white'} 
          />
        </Pressable>
      </View>

      {/* Bottom Overlay */}
      <View style={styles.bottomOverlay}>
        <TitleText variant='h1'>
          Party {id}
        </TitleText>
        
        {/* Settings Button in Bottom Right */}
        <Pressable
          style={styles.bottomGearButton}
          onPress={handleSettings}
          disabled={isLocked}
        >
          <Feather name="settings" size={28} color={isLocked ? '#666' : 'white'} />
        </Pressable>
      </View>

      {/* Settings Overlay */}
      {showSettings && (
        <View style={styles.settingsOverlay}>
          <View style={styles.settingsContent}>
            {/* Gear Icon */}
            <View style={styles.settingsSection}>
              <Feather name="settings" size={48} color="white" />
            </View>

            {/* QR Icon with Copy Button */}
            <View style={styles.settingsSection}>
              <FontAwesome6 name="qrcode" size={100} color="white" />
              <View style={{ marginTop: 10 }}>
                <ComButton
                  text={copyButtonText}
                  textColor='black'
                  textSizeVariant='h3'
                  backgroundColor='white'
                  onPress={handleCopyQR}
                />
                <ComButton
                  text='SHARE'
                  textColor='black'
                  textSizeVariant='h2'
                  backgroundColor='#FF87DF'
                  onPress={handleShare}
                />
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.settingsSection}>
              <ComButton
                text='LEAVE PARTY'
                textColor='white'
                textSizeVariant='h2'
                backgroundColor='black'
                onPress={handleLeaveParty}
              />
              <ComButton
                text='RETURN HOME'
                textColor='white'
                textSizeVariant='h2'
                backgroundColor='black'
                onPress={handleLeaveParty}
              />
              <ComButton
                text='dismiss'
                textColor='white'
                textSizeVariant='h3'
                hasContainer={false}
                onPress={dismissSettings}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  lockButton: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 8,
    zIndex: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  lockButtonActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  lockButtonInner: {
    alignItems: 'center',
  },
  playPauseButton: {
    padding: 20,
  },
  bottomOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  bottomGearButton: {
    padding: 10,
  },
  settingsOverlay: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    right: '5%',
    bottom: '10%',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  settingsContent: {
    width: '85%',
    alignItems: 'center',
  },
  settingsSection: {
    marginVertical: 20,
    alignItems: 'center',
    width: '100%',
  },
});
