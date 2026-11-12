import { Image, View, Platform, ActivityIndicator } from 'react-native';

interface LoadingIndicatorProps {
  androidColor?: string;
  size?: 'small' | 'large';
}

const sizes = {
  small: { width: 50, height: 50 },
  large: { width: 35, height: 100 },
}

const LoadingIndicator = ({
  androidColor='white',
  size='large'
}: LoadingIndicatorProps) => {
  if (Platform.OS === 'android') {
    return <ActivityIndicator size={size} color={androidColor} />
  } else {
    return (
      <View
        style={{
          width: 35,
          height: 65,
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <Image
          resizeMode={'cover'}
          source={require('@/assets/gifs/dancer.gif')}
          // source={require('@/assets/gifs/bubble.gif')}
          style={[
            size == 'small' 
              ? sizes.small
              : sizes.large,
            {
              position: 'absolute',
              top: -15,
            }
          ]}
        />
      </View>
    )
  }
}

export default LoadingIndicator;