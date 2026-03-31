import renderMathInElement from "katex/dist/contrib/auto-render.mjs"

document.querySelectorAll(".gdoc-katex").forEach((element) => {
  renderMathInElement(element)
})
