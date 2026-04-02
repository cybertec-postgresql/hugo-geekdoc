import Storage from "store2"
import {
  TOGGLE_COLOR_THEMES,
  THEME,
  COLOR_THEME_AUTO,
  COLOR_THEME_LIGHT,
  COLOR_THEME_DARK,
} from "./config.js"

function resolveStoredColorTheme(stored) {
  if (TOGGLE_COLOR_THEMES.includes(stored)) {
    return stored
  }
  if (
    stored === COLOR_THEME_AUTO ||
    stored === undefined ||
    stored === null ||
    stored === ""
  ) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? COLOR_THEME_DARK
      : COLOR_THEME_LIGHT
  }
  return COLOR_THEME_LIGHT
}

function applyTheme(init = true) {
  if (Storage.isFake()) return

  const lstore = Storage.namespace(THEME)
  const html = document.documentElement
  const raw = lstore.get("color-theme")
  const currentColorTheme = resolveStoredColorTheme(raw)

  if (raw !== currentColorTheme) {
    lstore.set("color-theme", currentColorTheme)
  }

  html.setAttribute("class", `color-toggle-${currentColorTheme}`)
  html.setAttribute("color-theme", currentColorTheme)

  if (!init) {
    // Reload required to re-initialize e.g. Mermaid with the new theme
    // and re-parse the Mermaid code blocks.
    location.reload()
  }
}

function toggle(list = [], value) {
  const current = list.indexOf(value)
  const max = list.length - 1
  let next = 0

  if (current < max) {
    next = current + 1
  }

  return next
}

;(() => {
  applyTheme()
})()

document.addEventListener("DOMContentLoaded", () => {
  const colorThemeToggle = document.getElementById("gdoc-color-theme")

  const toggleColorTheme = () => {
    const lstore = Storage.namespace(THEME)
    const currentColorTheme = resolveStoredColorTheme(lstore.get("color-theme"))
    const nextColorTheme = toggle(TOGGLE_COLOR_THEMES, currentColorTheme)

    lstore.set("color-theme", TOGGLE_COLOR_THEMES[nextColorTheme])
    applyTheme(false)
  }

  colorThemeToggle.onclick = () => {
    toggleColorTheme()
  }

  colorThemeToggle.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      toggleColorTheme()
      event.preventDefault()
    }
  })
})
