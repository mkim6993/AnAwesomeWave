import { useRouter, router } from 'expo-router';
import { Button, StyleSheet, Text, View, Image, useWindowDimensions } from "react-native";

// components
import TitleText from '@/components/ui/TitleText';
import ComButton from '@/components/ui/ComButton';

// 

export default function CreateScreen() {
  const { height: screenHeight, width: screenWidth, scale, fontScale } = useWindowDimensions();

  const goToOverview = () => {
    router.push('/overview/8329kc')
  }

  const goToPreview = () => {
    router.push({
      pathname: '/party/[id]',
      params: { 
        id: '38dk3',
        isPreview: 'true'
       }
    })
  }

  const goToBoard = () => {
    router.navigate('/')
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
      <Image
        source={require('@/assets/images/currents.png')}
        resizeMode={'cover'}
        style={{
          // width: '50%',
          // height: '50%'
          width: screenWidth * .55,
          height: screenWidth * .8
        }}
      />
      
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
          onPress={goToOverview}
        />
        <ComButton
          text='PREVIEW INVITE'
          textColor='black'
          textSizeVariant='h3'
          backgroundColor='#FF87DF'
          onPress={goToPreview}
        />
        <ComButton
          text='start over'
          textColor='black'
          textSizeVariant='h3'
          hasContainer={false}
          onPress={() => alert('clear')}
        />
      </View>
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
  }
});
