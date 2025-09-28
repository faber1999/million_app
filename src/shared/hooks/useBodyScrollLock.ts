import { useEffect } from 'react'

export const useBodyScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (isLocked) {
      // Store original overflow style
      const originalStyle = window.getComputedStyle(document.body).overflow
      
      // Prevent scrolling
      document.body.style.overflow = 'hidden'
      
      // Cleanup function to restore original overflow
      return () => {
        document.body.style.overflow = originalStyle
      }
    }
  }, [isLocked])
}