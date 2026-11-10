import { View, Pressable, StyleSheet } from 'react-native';

// components
import TitleText from '@/components/ui/TitleText';

interface ComButtonProps {
  onPress: () => void;
  text: string;
  textColor: string;
  textSizeVariant: 'h1' | 'h2' | 'h3';
  backgroundColor?: string;
  disabled?: boolean;
  hasContainer?: boolean;
}

const ComButton = ({
  onPress,
  text,
  textColor='black',
  textSizeVariant,
  backgroundColor='none',
  disabled,
  hasContainer=true
}: ComButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: hasContainer ? backgroundColor : 'none',
        opacity: disabled ? 0.5 : 1,
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderColor: textColor,
        borderWidth: hasContainer ? 2 : 0,
        ...styles.container
      }}
    >
      <TitleText
        variant={textSizeVariant}
        color={textColor}
      >{text}</TitleText>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
  }
})

export default ComButton;