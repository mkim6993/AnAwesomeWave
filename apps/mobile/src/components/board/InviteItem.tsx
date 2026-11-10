import { StyleSheet, View, Image, Pressable, Text } from 'react-native';
import { useState } from 'react';

// components
import TitleText from '@/components/ui/TitleText';

// icons
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

interface InviteItemProps {
  onPress: () => void;
  title: string;
  from: string;
  message?: string;
  sealColor?: string;
}

const InviteItem = ({
  onPress,
  title,
  from,
  message='',
  sealColor='#FF87DF',
}: InviteItemProps) => {
  const [dimensions, setDimensions] = useState({ width: 400, height: 180 });

  return (
    <Pressable
      style={styles.itemContainer}
      onPress={onPress}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setDimensions({ width, height });
      }}
    >
      {/* Envelope Body (Rectangle) */}
      <View style={styles.envelopeBody} />
      
      {/* Bottom Flap (Obtuse Triangle) */}
      <View style={[
        styles.bottomFlap,
        {
          borderLeftWidth: dimensions.width / 2,
          borderRightWidth: dimensions.width / 2,
          borderBottomWidth: dimensions.height / 2,
          bottom: dimensions.height / 10,
        }
      ]} />
      <View style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: dimensions.height / 10,
        backgroundColor: '#e7e7e7',
      }}/>

      <View style={{
        position: 'absolute',
        top: 0,
        width: '100%',
        height: dimensions.height / 5,
        backgroundColor: '#fbfbfb',
        zIndex: 10,
        alignItems: 'center',
      }}>
        <View
          style={{
            position: 'absolute',
            // backgroundColor: 'orange',
            alignItems: 'center',
          }}
        >
          <TitleText>{title}</TitleText>
          <Text style={{ fontWeight: '600' }}>FROM. {from}</Text>
          <Text style={{ fontWeight: '600' }}>{message}</Text>
        </View>
      </View>
      
      {/* Top Flap (Obtuse Triangle folded over) */}
      <View style={[
        styles.topFlap,
        {
          borderLeftWidth: dimensions.width / 2,
          borderRightWidth: dimensions.width / 2,
          borderTopWidth: dimensions.height / 2,
          top: dimensions.height / 5, // Position it down to overlap the bottom flap's peak
        }
      ]} />

      <View
        style={{
          backgroundColor: sealColor,
          width: dimensions.width / 6,
          height: dimensions.width / 6,
          borderWidth: 2,
          borderRadius: 50,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: dimensions.height / 8,
          transform: [{ rotate: '180deg' }]
        }}
      >
        <FontAwesome6
          name="face-grin-hearts"
          size={dimensions.height / 5}
          color="black"
        />
      </View>
    </Pressable>
  )
}
const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    maxWidth: 400,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
  },
  envelopeBody: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgb(213, 213, 213)', // Beige/cream color for envelope
  },
  bottomFlap: {
    position: 'absolute',
    bottom: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#e7e7e7', // Slightly darker shade for depth
    // borderBottmColor: 'red',
  },
  topFlap: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#fbfbfb', // Darker shade for the top flap
  },
})

export default InviteItem;