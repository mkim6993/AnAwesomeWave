# Screen Design Guide

This guide documents the design patterns, styling conventions, and component usage for creating screens in this mobile application.

## Design Philosophy

- **Simplicity First**: Keep layouts clean and straightforward with minimal complexity
- **Vertical Flow**: Arrange elements from top to bottom in a logical reading order
- **Reusable Components**: Use existing UI components (`TitleText`, `ComButton`) instead of creating one-offs
- **Consistent Spacing**: Use `formContainer` for grouping related elements with consistent margins

## Color Palette

Use this limited color palette throughout the app:

- **Primary Green**: `#84FF32` - Used for primary actions (e.g., "CREATE NOW", "CONTROL BOARD")
- **Primary Pink**: `#FF87DF` - Used for secondary actions (e.g., "PREVIEW INVITE", "SHARE")
- **Black**: `#000000` or `'black'` - Used for backgrounds, text, and tertiary actions
- **White**: `#FFFFFF` or `'white'` - Used for text on dark backgrounds

## Layout Structure

### Container Pattern
```tsx
<View style={styles.container}>
  {/* Screen content */}
</View>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 10,
  },
});
```

### Form Container Pattern
Use for grouping related content with consistent spacing:
```tsx
<View style={styles.formContainer}>
  {/* Grouped content */}
</View>

const styles = StyleSheet.create({
  formContainer: {
    marginVertical: 10,
  }
});
```

## Component Usage

### TitleText Component

Used for all text display with three variants:

- **h1**: Large titles (32px, bold) - Main content values
- **h2**: Medium titles (24px, semibold) - Button text, section headers
- **h3**: Small titles (20px, semibold) - Field labels, descriptions

```tsx
// Label pattern
<TitleText variant='h3'>
  Party Name:
</TitleText>

// Value pattern
<TitleText variant='h1'>
  Party Name
</TitleText>
```

### ComButton Component

Used for all interactive buttons with consistent styling:

```tsx
// Primary action (green background)
<ComButton
  text='PRIMARY ACTION'
  textColor='black'
  textSizeVariant='h2'
  backgroundColor='#84FF32'
  onPress={handleAction}
/>

// Secondary action (pink background)
<ComButton
  text='SECONDARY ACTION'
  textColor='white'
  textSizeVariant='h2'
  backgroundColor='#FF87DF'
  onPress={handleAction}
/>

// Tertiary action (black background)
<ComButton
  text='TERTIARY ACTION'
  textColor='white'
  textSizeVariant='h2'
  backgroundColor='black'
  onPress={handleAction}
/>

// Text-only button (no background)
<ComButton
  text='text action'
  textColor='black'
  textSizeVariant='h3'
  hasContainer={false}
  onPress={handleAction}
/>
```

### Button Hierarchy
1. **Primary buttons** - Green background, uppercase text, h2 size
2. **Secondary buttons** - Pink background, uppercase text, h2 size
3. **Tertiary buttons** - Black background, uppercase text, h2 size
4. **Text buttons** - No background, lowercase text, h3 size

## Images

Use responsive sizing based on screen dimensions:

```tsx
import { useWindowDimensions } from "react-native";

const { width: screenWidth } = useWindowDimensions();

<Image
  source={require('@/assets/images/currents.png')}
  resizeMode={'cover'}
  style={{
    width: screenWidth * .55,
    height: screenWidth * .8
  }}
/>
```

## Screen Structure Template

A typical screen should follow this vertical structure:

1. **Title/Name Section**
   - Label (h3)
   - Value (h1)
   - Wrapped in `formContainer`

2. **Visual Content** (optional)
   - Label (h3)
   - Image with responsive sizing

3. **Additional Info** (optional)
   - Multiple sections following the label/value pattern
   - Each wrapped in `formContainer`

4. **Action Buttons**
   - Grouped in a `formContainer`
   - Ordered by importance (primary, secondary, tertiary, text)

## Navigation

Use `expo-router` for navigation with typed params:

```tsx
import { router, useLocalSearchParams } from 'expo-router';

// Navigate with params
const goToScreen = () => {
  router.push({
    pathname: '/path/[id]',
    params: { 
      id: 'value',
      otherParam: 'value'
    }
  })
}

// Receive params
const { id, otherParam } = useLocalSearchParams<{ 
  id: string; 
  otherParam?: string 
}>();
```

## Import Pattern

Keep imports organized in this order:

```tsx
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Image, useWindowDimensions } from "react-native";

// components
import TitleText from '@/components/ui/TitleText';
import ComButton from '@/components/ui/ComButton';
```

## Examples

Reference these screens for implementation patterns:
- **Create Screen**: `/src/app/(home)/create.tsx` - Multi-section form with image and buttons
- **Overview Screen**: `/src/app/overview/[id].tsx` - Simple display with action buttons

## Don't

- Don't use inline styles for repeated patterns - use StyleSheet
- Don't create custom Text components - use TitleText
- Don't create custom Button components - use ComButton
- Don't use colors outside the defined palette
- Don't center-align containers unless specifically needed
- Don't add extra complexity - keep it simple


Colors for operator
#DCDCDD
#C5C3C6
#46494C
#4C5C68
#1985A1