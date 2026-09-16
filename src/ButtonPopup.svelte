<script lang="ts">
  import { onMount, tick } from 'svelte'
  import Button from './Button.svelte'
  import './style.css'

  type WindowSize = number | `${number}%`

  let {
    color = 'gray',
    winWidth = 300,
    winHeight = 400,
    expandInPlace = false,
    onclick,
    onaltclick,
    trigger,
    children,
  } = $props<{
    color?: string
    winWidth?: WindowSize
    winHeight?: WindowSize
    expandInPlace?: boolean
    onclick?: (event?: MouseEvent) => void
    onaltclick?: (event: PointerEvent | MouseEvent) => void
    trigger?: any
    children?: any
  }>()

  let open = $state(false)
  let initialized = $state(false)

  let anchorEl: HTMLDivElement

  let startX = $state(0)
  let startY = $state(0)
  let centerX = $state(0)
  let centerY = $state(0)
  let initialWidth = $state(0)
  let initialHeight = $state(0)

  const winMargin = 35

  function getWindowSize(value: WindowSize, viewportSize: number): number {
    if (typeof value === 'number') {
      return value
    }

    const percentage = Number.parseFloat(value)

    return (viewportSize * percentage) / 100
  }

  function getPopupWidth() {
    return Math.min(
      getWindowSize(winWidth, window.innerWidth),
      window.innerWidth - winMargin * 2,
    )
  }

  function getPopupHeight() {
    return Math.min(
      getWindowSize(winHeight, window.innerHeight),
      window.innerHeight - winMargin * 2,
    )
  }

  function updateStartPosition() {
    const rect = anchorEl.getBoundingClientRect()

    startX = rect.left + rect.width / 2
    startY = rect.top + rect.height / 2
    initialWidth = rect.width
    initialHeight = rect.height
  }

  async function openWindow() {
    const rect = anchorEl.getBoundingClientRect()

    startX = rect.left + rect.width / 2
    startY = rect.top + rect.height / 2
    initialWidth = rect.width
    initialHeight = rect.height

    const width = getPopupWidth()
    const height = getPopupHeight()

    let posX: number
    let posY: number

    if (expandInPlace) {
      posX = startX
      posY = startY
    } else {
      posX = window.innerWidth / 2
      posY = window.innerHeight / 2
    }

    // keep popup some pixels away from every edge
    posX = Math.max(
      width / 2 + winMargin,
      Math.min(posX, window.innerWidth - width / 2 - winMargin),
    )

    posY = Math.max(
      height / 2 + winMargin,
      Math.min(posY, window.innerHeight - height / 2 - winMargin),
    )

    centerX = posX
    centerY = posY

    initialized = false
    open = true

    await tick()

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        initialized = true
      })
    })
  }

  function closeWindow() {
    open = false
    initialized = false
  }

  onMount(() => {
    updateStartPosition()

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updateStartPosition()
      })
    })

    function updatePosition() {
      if (!open) {
        updateStartPosition()
      }
    }

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition)
    }
  })
</script>

<div bind:this={anchorEl} class="anchor">
  <div class="trigger" class:hidden={open}>
    <Button {color} onclick={onclick ?? openWindow} onaltclick={onaltclick ?? openWindow}>
      {@render trigger?.()}
    </Button>
  </div>
</div>

{#if open}
  <button type="button" class="backdrop" aria-label="close" onclick={closeWindow}
  ></button>

  <div
    class="window"
    class:initialized
    style="
      --start-x: {startX}px;
      --start-y: {startY}px;
      --initial-width: {initialWidth}px;
      --initial-height: {initialHeight}px;
      --center-x: {centerX}px;
      --center-y: {centerY}px;
      --win-width: {getPopupWidth()}px;
      --win-height: {getPopupHeight()}px;
    "
  >
    <button class="close" onclick={closeWindow}>×</button>

    <div class="content">
      {@render children?.()}
    </div>
  </div>
{/if}

<style>
  .anchor {
    width: 100%;
    height: 100%;
  }

  .trigger {
    width: 100%;
    height: 100%;
  }

  .trigger.hidden {
    visibility: hidden;
  }

  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 99;

    width: 100%;
    height: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: default;
  }

  .window {
    position: fixed;
    z-index: 100;

    left: var(--start-x);
    top: var(--start-y);

    width: var(--initial-width);
    height: var(--initial-height);

    transform: translate(-50%, -50%);

    border-radius: 22px;

    transition: none;
  }

  /* Transitions only enabled after initial position was set */
  .window.initialized {
    transition:
      left 400ms cubic-bezier(0.2, 0.8, 0.2, 1),
      top 400ms cubic-bezier(0.2, 0.8, 0.2, 1),
      width 400ms cubic-bezier(0.2, 0.8, 0.2, 1),
      height 400ms cubic-bezier(0.2, 0.8, 0.2, 1),
      border-radius 400ms ease;

    left: var(--center-x);
    top: var(--center-y);

    width: var(--win-width);
    height: var(--win-height);

    border-radius: 16px;
    border: 1px solid var(--gray);

    padding: 8px;
    overflow: scroll;
    scrollbar-width: none;
    box-sizing: border-box;
    background: var(--bg);
  }

  .close {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 1;
  }

  .content {
    width: 100%;
    height: 100%;
  }
</style>
