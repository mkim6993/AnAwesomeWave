import { View, StyleSheet, Text, Share } from 'react-native';
import { useState } from 'react';
import { FontAwesome6 } from '@expo/vector-icons';

// Libraries
import * as Clipboard from 'expo-clipboard';

// Components
import TitleText from '@/components/ui/TitleText';
import ComButton from '@/components/ui/ComButton';

interface ShareSectionProps {
  joinCode: string;
  onShare: () => void;
  qrSize?: number;
  iconColor?: string;
}

const ShareSection = ({
  joinCode='',
  onShare=() => null,
  qrSize = 100,
  iconColor = 'white',
}: ShareSectionProps) => {
  const [copyButtonText, setCopyButtonText] = useState('COPY');
  const [copyTimeout, setCopyTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = async () => {
    try {
      if (joinCode != '') {
        // Clear any existing timeout to handle spam
        if (copyTimeout) {
          clearTimeout(copyTimeout);
        }

        await Clipboard.setStringAsync(joinCode);

        // Update button text
        setCopyButtonText('COPIED!');
        
        // Reset text after 2 seconds
        const timeout = setTimeout(() => {
          setCopyButtonText('COPY');
        }, 2000);
        
        setCopyTimeout(timeout);
      }
    } catch (error) {
      alert(`something failed ${joinCode}`);
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Join my party using this code! ${joinCode}`,
      })
    } catch (error) {
      
    }
  }

  return (
    <View style={styles.container}>
      {/* <FontAwesome6 name="qrcode" size={qrSize} color={iconColor} /> */}
      <View>
        <Text style={{ color: 'white' }}>Join code:</Text>
        <TitleText color='white'>{joinCode}</TitleText>
      </View>
      <View style={styles.buttonContainer}>
        <ComButton
          text={copyButtonText}
          textColor='black'
          textSizeVariant='h3'
          backgroundColor='white'
          onPress={handleCopy}
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
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: 'center',
    width: '100%',
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default ShareSection;
