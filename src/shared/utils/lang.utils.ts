export const getCurrentLang = () => {
  const localLang = localStorage.getItem('i18nextLng')

  const langCode = localLang ? localLang : getBrowserLang()

  const lang = langCode.includes('-') ? langCode.split('-')[0] : langCode

  return lang
}

export const getBrowserLang = () => {
  const langCode = navigator.language
  const lang = langCode.includes('-') ? langCode.split('-')[0] : langCode
  return lang
}

export const animateCSS = (querySelector: string, animations: string[]): Promise<string> =>
  // We create a Promise and return it

  new Promise((resolve) => {
    const prefix = 'animate__'

    const animationNames = animations.reduce((currentAnimations: string[], animation) => {
      currentAnimations.push(`${prefix}${animation}`)
      return currentAnimations
    }, [])

    const node = document.querySelector(querySelector)
    node?.classList.add(...animationNames)

    if (node?.classList.contains('hidden')) {
      node.classList.toggle('hidden')
    }

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event: AnimationEvent) {
      event.stopPropagation()
      node?.classList.remove(...animationNames)
      resolve('Animation ended')
    }

    node?.addEventListener('animationend', handleAnimationEnd as EventListener, { once: true })
  })
