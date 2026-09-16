<script lang="ts">
  let {
    active = false,
    color = 'gray',
    children,
    href,
    onclick,
    onaltclick,
  }: {
    active?: boolean
    color?: string
    children?: any
    href?: string
    onclick?: (event?: MouseEvent) => void
    onaltclick?: (event: PointerEvent | MouseEvent) => void
  } = $props()

  const LONG_PRESS = 500
  const MOVE_LIMIT = 10

  let timer: ReturnType<typeof setTimeout> | undefined
  let startX = 0
  let startY = 0
  let longPressed = false

  function pointerDown(event: PointerEvent) {
    // Right mouse button is handled by contextmenu instead
    if (event.pointerType === 'mouse' && event.button === 2) {
      return
    }

    startX = event.clientX
    startY = event.clientY
    longPressed = false

    timer = setTimeout(() => {
      longPressed = true
      onaltclick?.(event)
    }, LONG_PRESS)
  }

  function pointerMove(event: PointerEvent) {
    if (
      Math.abs(event.clientX - startX) > MOVE_LIMIT ||
      Math.abs(event.clientY - startY) > MOVE_LIMIT
    ) {
      cancelPress()
    }
  }

  function pointerUp() {
    clearTimeout(timer)
    timer = undefined
  }

  function cancelPress() {
    clearTimeout(timer)
    timer = undefined
  }

  function handleClick(event: MouseEvent) {
    if (!longPressed) {
      onclick?.(event)
    }

    longPressed = false
  }

  function handleContextMenu(event: MouseEvent) {
    if (!longPressed) {
      event.preventDefault()
      onaltclick?.(event)
    }

    longPressed = false
  }
</script>

{#if href}
  <a
    {href}
    onclick={handleClick}
    oncontextmenu={handleContextMenu}
    onpointerdown={pointerDown}
    onpointermove={pointerMove}
    onpointerup={pointerUp}
    onpointercancel={cancelPress}
    onpointerleave={cancelPress}
    class="glass-bg button"
    class:active
    style={`--color: ${color}`}
  >
    {@render children?.()}
  </a>
{:else}
  <button
    onclick={handleClick}
    oncontextmenu={handleContextMenu}
    onpointerdown={pointerDown}
    onpointermove={pointerMove}
    onpointerup={pointerUp}
    onpointercancel={cancelPress}
    onpointerleave={cancelPress}
    class="glass-bg button"
    class:active
    style={`--color: ${color}`}
  >
    {@render children?.()}
  </button>
{/if}

<style>
  .button {
    position: relative;
    flex: 1;
    height: 100%;
    width: 100%;
    border: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    border-radius: 99px;
    color: var(--fg);
    text-decoration: none;
  }

  .button::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 1px;
    border-radius: inherit;
    pointer-events: none;

    background: conic-gradient(
      from 45deg,

      transparent 0deg,
      transparent 35deg,

      color-mix(in srgb, var(--color) 85%, transparent) 60deg,
      color-mix(in srgb, var(--color) 25%, transparent) 95deg,

      transparent 120deg,
      transparent 210deg,

      color-mix(in srgb, var(--color) 75%, transparent) 235deg,
      color-mix(in srgb, var(--color) 20%, transparent) 275deg,

      transparent 300deg
    );

    mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);

    mask-composite: exclude;
    -webkit-mask-composite: xor;
  }

  .button:active,
  .button.active {
    background-color: color-mix(in srgb, var(--color) 30%, transparent);
  }
</style>
