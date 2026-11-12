# Marquee Component Display Issue

## Overview

The Marquee component displays animated scrolling text in multiple directions.

**BUG**: Horizontal directions (left, right) and all diagonal directions (upR, upL, downR, downL) fail to display or animate text correctly.

## Component Purpose

Creates a ticker-style text animation that:
- Displays text items one at a time from an array
- Animates text across the screen in configurable directions
- Cycles through multiple text items sequentially
- Supports single direction mode or multi-direction flow mode

## Working vs Broken Directions

### Working ✅
- `up` - Text scrolls from bottom to top
- `down` - Text scrolls from top to bottom

### Broken ❌
- `left` - Should scroll right to left (NOT WORKING)
- `right` - Should scroll left to right (NOT WORKING)
- `upR` - Should scroll diagonally bottom-left to top-right (NOT WORKING)
- `upL` - Should scroll diagonally bottom-right to top-left (NOT WORKING)
- `downR` - Should scroll diagonally top-left to bottom-right (NOT WORKING)
- `downL` - Should scroll diagonally top-right to bottom-left (NOT WORKING)

## The Problem

When direction prop is set to any horizontal or diagonal value:
1. Text does not appear on screen
2. No animation occurs
3. Component renders empty or blank

## Current Test Case

**Location**: `apps/mobile/src/app/(home)/profile.tsx`

```typescript
<Marquee
  texts={['1. This is a long ticker', '2. who is this', '3. jodan michael idk now to spell', '4. Cream']}
  fontSize={24}
  color="#FFFFFF"
  direction="left"
  containerDimensions={{ width: 500, height: 200 }}
  flowSpeed={500}
  durationBetweenUnit={0}
/>


Add horizontal and diagonal scrolling support to Marquee component

The Marquee component at apps/mobile/src/components/ui/Marquee.tsx currently only supports vertical scrolling (up/down directions). I need to add support for horizontal scrolling (left/right) and diagonal scrolling (upR, upL, downR, downL).

CURRENT BEHAVIOR:
- direction="up" works: text scrolls bottom to top ✓
- direction="down" works: text scrolls top to bottom ✓
- direction="left" fails: text should scroll right to left but doesn't appear
- direction="right" fails: text should scroll left to right but doesn't appear
- direction="upR" fails: should scroll diagonally bottom-left to top-right
- direction="upL" fails: should scroll diagonally bottom-right to top-left
- direction="downR" fails: should scroll diagonally top-left to bottom-right
- direction="downL" fails: should scroll diagonally top-right to bottom-left

DESIRED BEHAVIOR:
All 8 directions should work smoothly with text:
1. Starting offscreen in the appropriate position
2. Animating across the visible container
3. Exiting offscreen on the opposite side
4. Maintaining consistent animation speed across all directions

TEST CASE:
Location: apps/mobile/src/app/(home)/profile.tsx (lines 18-28)
Current usage: direction="left" renders nothing
Expected: Text should scroll horizontally from right to left

TECHNICAL CONTEXT:
- Component uses react-native-reanimated with translateX/translateY transforms
- The getPositions() function calculates start/end coordinates for each direction
- Animation uses withTiming() with linear easing
- Container has overflow: hidden to clip offscreen content

REQUIREMENTS:
1. Fix horizontal directions (left, right) to properly display and animate text
2. Fix all 4 diagonal directions (upR, upL, downR, downL) to animate along diagonal paths
3. Ensure animation speed is consistent across all directions
4. Maintain existing vertical scrolling behavior (no regressions)
5. Text should be visible during the animation, not just offscreen
