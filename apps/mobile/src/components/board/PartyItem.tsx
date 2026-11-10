import { StyleSheet, View, Image, Pressable, Text } from 'react-native';

// components
import TitleText from '@/components/ui/TitleText';

// helpers
import { indexToSource } from '@/utils/images/sampleImages';

// props
interface PartyItemProps {
  onPress?: () => void;
  title: string;
  message?: string;
  backgroundColor?: string;
  sampleImageIndex?: number;
  imageOpacity?: number;
}
const PartyItem = ({
  onPress=()=>alert('error'),
  title,
  message='',
  backgroundColor='#84FF32',
  sampleImageIndex=1,
  imageOpacity=1,
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
  }
})

export default PartyItem;
