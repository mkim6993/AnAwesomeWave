import { Image, View, Platform, ActivityIndicator, Text, useWindowDimensions } from 'react-native';

import LoadingIndicator from './LoadingIndicator';
import TitleText from './TitleText';

interface LoadingIndicatorProps {
  androidColor?: string;
  size?: 'small' | 'large';
  visible?: boolean;
}

const LoadingIsland = ({
  androidColor='white',
  size='small',
  visible=true,
}: LoadingIndicatorProps) => {
  const { height, width } = useWindowDimensions();

  return (
    <View
      style={[
        {
          // backgroundColor: 'green',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        },
        visible !== true &&  { display: 'none' }
      ]}
    >
      {/* Triangle container */}
      <View style={{ position: 'relative', width: 120, height: 104 }}>
        {/* Triangle shape */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            backgroundColor: 'transparent',
            borderStyle: 'solid',
            borderLeftWidth: 60,
            borderRightWidth: 60,
            borderBottomWidth: 104,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: 'rgba(0,0,0,0.6)',
          }}
        />
        
        {/* Content centered in triangle */}
        <View
          style={{
            position: 'absolute',
            top: 40, // Adjust to center vertically in triangle
            left: 0,
            right: 0,
            alignItems: 'center',
          }}
        >
          <LoadingIndicator
            androidColor={androidColor}
            size={size}
          />
        </View>
      </View>
    </View>
  )
}

export default LoadingIsland;