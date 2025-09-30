import { beforeEach, describe, expect, it, vi } from 'vitest'
import { animateCSS, getBrowserLang, getCurrentLang } from './lang.utils'

describe('lang.utils', () => {
  describe('getBrowserLang', () => {
    it('should return language code from navigator.language', () => {
      Object.defineProperty(navigator, 'language', {
        value: 'en-US',
        configurable: true
      })

      const result = getBrowserLang()
      expect(result).toBe('en')
    })

    it('should return full language code if no hyphen present', () => {
      Object.defineProperty(navigator, 'language', {
        value: 'es',
        configurable: true
      })

      const result = getBrowserLang()
      expect(result).toBe('es')
    })

    it('should extract language from complex locale codes', () => {
      Object.defineProperty(navigator, 'language', {
        value: 'zh-Hans-CN',
        configurable: true
      })

      const result = getBrowserLang()
      expect(result).toBe('zh')
    })
  })

  describe('getCurrentLang', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    it('should return language from localStorage if exists', () => {
      localStorage.setItem('i18nextLng', 'es-ES')

      const result = getCurrentLang()
      expect(result).toBe('es')
    })

    it('should return browser language if localStorage is empty', () => {
      Object.defineProperty(navigator, 'language', {
        value: 'fr-FR',
        configurable: true
      })

      const result = getCurrentLang()
      expect(result).toBe('fr')
    })

    it('should handle full language code from localStorage', () => {
      localStorage.setItem('i18nextLng', 'pt')

      const result = getCurrentLang()
      expect(result).toBe('pt')
    })
  })

  describe('animateCSS', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
    })

    it('should add animation classes to element', () => {
      document.body.innerHTML = '<div class="test-element"></div>'

      animateCSS('.test-element', ['fadeIn', 'fast'])

      const element = document.querySelector('.test-element')
      expect(element?.classList.contains('animate__fadeIn')).toBe(true)
      expect(element?.classList.contains('animate__fast')).toBe(true)
    })

    it('should resolve promise when animation ends', async () => {
      document.body.innerHTML = '<div class="test-element"></div>'

      const promise = animateCSS('.test-element', ['fadeIn'])

      const element = document.querySelector('.test-element')
      element?.dispatchEvent(new Event('animationend'))

      const result = await promise
      expect(result).toBe('Animation ended')
    })

    it('should remove hidden class if present', () => {
      document.body.innerHTML = '<div class="test-element hidden"></div>'

      animateCSS('.test-element', ['fadeIn'])

      const element = document.querySelector('.test-element')
      expect(element?.classList.contains('hidden')).toBe(false)
    })

    it('should handle non-existent elements gracefully', async () => {
      const promise = animateCSS('.non-existent', ['fadeIn'])

      // Should not throw, just return the promise that never resolves naturally
      // We'll timeout it for testing purposes
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve('timeout'), 100))
      const result = await Promise.race([promise, timeoutPromise])

      expect(result).toBe('timeout')
    })

    it('should remove animation classes after animation ends', async () => {
      document.body.innerHTML = '<div class="test-element"></div>'

      const promise = animateCSS('.test-element', ['bounce'])

      const element = document.querySelector('.test-element')
      expect(element?.classList.contains('animate__bounce')).toBe(true)

      element?.dispatchEvent(new Event('animationend'))
      await promise

      expect(element?.classList.contains('animate__bounce')).toBe(false)
    })
  })
})