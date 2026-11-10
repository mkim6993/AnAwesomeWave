import { Text, StyleSheet, TextProps } from 'react-native';
import { ReactNode } from 'react';

interface TitleProps extends Omit<TextProps, 'style'> {
  children: ReactNode;
  variant?: 'h1' | 'h2' | 'h3';
  size?: number;
  color?: string;
}

const styles = {
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
} as const;

const TitleText = ({
  children,
  variant = 'h2',
  size,
  color,
  ...textProps
}: TitleProps) => {
  return (
    <Text
      {...textProps}
      style={[
        styles[variant],
        size !== undefined && { fontSize: size },
        color !== undefined && { color },
      ]}
    >
      {children}
    </Text>
  )
}

export default TitleText;
