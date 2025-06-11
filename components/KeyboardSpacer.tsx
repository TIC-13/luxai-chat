import { useKeyboard } from '@react-native-community/hooks'
import { useEffect } from 'react'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated'

/**
 * A View that expands to the height of the keyboard when it is shown with smooth animations.
 * This is useful for ensuring that input fields are not obscured by the keyboard.
 */
export function KeyboardSpacer() {
  const { keyboardShown, keyboardHeight } = useKeyboard()
  const animatedHeight = useSharedValue(0)

  useEffect(() => {
    if (keyboardShown) {
      animatedHeight.value = withTiming(keyboardHeight + 5, {
        duration: 200,
      })
    } else {
      animatedHeight.value = withTiming(0, {
        duration: 250,
      })
    }
  }, [keyboardShown, keyboardHeight, animatedHeight])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: animatedHeight.value,
    }
  })

  return <Animated.View style={animatedStyle} />
}