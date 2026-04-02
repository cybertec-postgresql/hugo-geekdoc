import Storage from "store2"
import {
  TOGGLE_COLOR_THEMES,
  THEME,
  COLOR_THEME_AUTO,
  COLOR_THEME_LIGHT,
  COLOR_THEME_DARK,
} from "./config.js"
;(() => {
  applyTheme()
})()

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

document.addEventListener("DOMContentLoaded", () => {
  const colorThemeToggle = document.getElementById("gdoc-color-theme")

  function toggleColorTheme() {
    let lstore = Storage.namespace(THEME)
    let currentColorTheme = resolveStoredColorTheme(lstore.get("color-theme"))
    let nextColorTheme = toggle(TOGGLE_COLOR_THEMES, currentColorTheme)

    lstore.set("color-theme", TOGGLE_COLOR_THEMES[nextColorTheme])
    applyTheme(false)
  }

  colorThemeToggle.onclick = function () {
    toggleColorTheme()
  }

  colorThemeToggle.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      toggleColorTheme()
      event.preventDefault()
    }
  })
})

function applyTheme(init = true) {
  if (Storage.isFake()) return

  let lstore = Storage.namespace(THEME)
  let html = document.documentElement
  let raw = lstore.get("color-theme")
  let currentColorTheme = resolveStoredColorTheme(raw)

  if (raw !== currentColorTheme) {
    lstore.set("color-theme", currentColorTheme)
  }

  html.setAttribute("class", "color-toggle-" + currentColorTheme)
  html.setAttribute("color-theme", currentColorTheme)

  if (!init) {
    // Reload required to re-initialize e.g. Mermaid with the new theme
    // and re-parse the Mermaid code blocks.
    location.reload()
  }
}

function toggle(list = [], value) {
  let current = list.indexOf(value)
  let max = list.length - 1
  let next = 0

  if (current < max) {
    next = current + 1
  }

  return next
}
