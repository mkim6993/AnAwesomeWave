import { StyleSheet, View, Image, Pressable, Text } from 'react-native';

// components
import TitleText from '@/components/ui/TitleText';

// helpers
import { indexToSource } from '@/utils/images/sampleImages';

// icons
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// props
interface PartyItemProps {
  onPress?: () => void;
  title: string;
  message?: string;
  backgroundColor?: string;
  sampleImageIndex?: number;
  imageOpacity?: number;
  type?: 'GUEST' | 'OPERATOR'; 
}
const PartyItem = ({
  onPress=()=>alert('error'),
  title,
  message='',
  backgroundColor='#84FF32',
  sampleImageIndex=1,
  imageOpacity=1,
  type='GUEST'
}: PartyItemProps) => {
  return (
    <Pressable
      style={[
        styles.itemContainer,
        {
          backgroundColor
        }
      ]}
      onPress={onPress}
    >
      <Image
        source={indexToSource(sampleImageIndex)}
        resizeMode={'cover'}
        style={{
          height: 160,
          width: '95%',
          borderWidth: .5,
          opacity: imageOpacity,
        }}
      />
      {type === 'OPERATOR' && (
        <View style={styles.operatorOverlayContainer}>
          <View style={{ height: '100%', justifyContent: 'space-between' }}>
            <MaterialIcons name="construction" size={50} color={backgroundColor} />
            <MaterialIcons name="construction" size={50} color={backgroundColor} />
          </View>
          <View style={{ height: '100%', justifyContent: 'space-between' }}>
            <MaterialIcons name="construction" size={50} color={backgroundColor} />
            <MaterialIcons name="construction" size={50} color={backgroundColor} />
          </View>
          <View style={{ height: '100%', justifyContent: 'space-between' }}>
            <MaterialIcons name="construction" size={50} color={backgroundColor} />
            <MaterialIcons name="construction" size={50} color={backgroundColor} />
          </View>
        </View>
      )}
      <View style={[
        styles.title,
        { backgroundColor }
        ]}
      >
        <TitleText
          variant='h1'
          paddingHorizontal={8}
          numberOfLines={1}
        >{title}</TitleText>
      </View>
      {message !== '' && (
        <View style={[
          styles.message,
          { backgroundColor }
          ]}
        >
          <TitleText
            variant='h3'
            paddingHorizontal={8}
            paddingVertical={1}
            numberOfLines={2}
          >{message}</TitleText>
        </View>
      )}
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
    borderWidth: 2,
    // overflow: 'hidden',
  },
  title: {
    position: 'absolute',
    top: 2,
    left: 8,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    maxWidth: 360
  },
  message: {
    position: 'absolute',
    bottom: 3,
    right: 8,
    borderLeftWidth: 2,
    borderTopWidth: 2
  },
  operatorOverlayContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
  }
})

export default PartyItem;
