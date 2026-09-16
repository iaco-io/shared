export function handleExternalUrl(event: MouseEvent) {
  const target = event.target as HTMLElement
  const link = target.closest('a')

  if (!link) return

  if (link.origin !== window.location.origin) {
    event.preventDefault()
    window.open(link.href, '_blank', 'noopener,noreferrer')
  }
}