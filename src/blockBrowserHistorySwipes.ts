export function blockBrowserHistorySwipes(
  onSwipeFromRight?: () => void,
  onSwipeFromLeft?: () => void,
  triggerThreshold = 50
) {
  const EDGE_SIZE_TO_STOP_HISTORY_SWIPE = 27

  let startX = 0
  let startY = 0
  let edge: 'left' | 'right' | null
  let currentX = 0

  function touchStart(event: TouchEvent) {
    const touch = event.touches[0]

    startX = touch.pageX
    startY = touch.pageY
    currentX = startX

    if (startX <= EDGE_SIZE_TO_STOP_HISTORY_SWIPE) {
      edge = 'left'
    } else if (startX >= window.innerWidth - EDGE_SIZE_TO_STOP_HISTORY_SWIPE) {
      edge = 'right'
    } else {
      edge = null
    }
  }

  function touchMove(event: TouchEvent) {
    if (!edge) return

    const touch = event.touches[0]
    const dx = touch.pageX - startX
    const dy = touch.pageY - startY

    if (Math.abs(dx) <= Math.abs(dy)) return // only handle horizontal swipes
    currentX = touch.pageX
    event.preventDefault() // block browser history swipe
  }

  function touchEnd() {
    if (edge) {
      const dx = currentX - startX

      if (Math.abs(dx) >= triggerThreshold) {
        if (edge === 'left' && dx > 0) {
          onSwipeFromLeft?.()
        } else if (edge === 'right' && dx < 0) {
          onSwipeFromRight?.()
        }
      }
    }

    edge = null
    currentX = 0
  }

  window.addEventListener('touchstart', touchStart, { passive: false })
  window.addEventListener('touchmove', touchMove, { passive: false })
  window.addEventListener('touchend', touchEnd)
  window.addEventListener('touchcancel', touchEnd)

  return () => {
    window.removeEventListener('touchstart', touchStart)
    window.removeEventListener('touchmove', touchMove)
    window.removeEventListener('touchend', touchEnd)
    window.removeEventListener('touchcancel', touchEnd)
  }
}