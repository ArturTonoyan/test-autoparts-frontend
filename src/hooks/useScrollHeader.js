import { useEffect, useRef, useState } from 'react'

/** Прячет хедер при скролле вниз / показывает при скролле вверх — только у указанного контейнера страницы */
export function useScrollHeader(scrollRef, { threshold = 8, topShow = 16 } = {}) {
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return undefined

    lastY.current = el.scrollTop

    const onScroll = () => {
      const y = el.scrollTop
      const delta = y - lastY.current
      lastY.current = y

      if (y <= topShow) {
        setHidden(false)
        return
      }
      if (delta > threshold) setHidden(true)
      else if (delta < -threshold) setHidden(false)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [scrollRef, threshold, topShow])

  return hidden
}
