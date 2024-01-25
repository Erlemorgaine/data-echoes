// http://www.w3.org/TR/AERT#color-contrast

export function getTextColorForCssBgColorVar(colorVariable: string): string {
  const themeEl = document.getElementById('theme-view')

  if (themeEl) {
    const rgb = getComputedStyle(themeEl).getPropertyValue(colorVariable).match(/\d+/g)

    if (rgb?.length) {
      const brightness = Math.round(
        (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000,
      )
      return brightness > 125 ? 'var(--off-black)' : 'var(--off-white)'
    }

    return ''
  }

  return ''
}
