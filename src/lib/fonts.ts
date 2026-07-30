import { FONT_ENTRIES } from "./fonts-data";

/**
 * Registers self-hosted Vietnamese fonts by injecting a <style> block whose
 * @font-face rules embed the full TTFs as base64 data URIs.
 *
 * Why this shape:
 *  - Data URIs mean zero network/file fetch, so rendering is fully offline and
 *    deterministic.
 *  - We deliberately do NOT use delayRender(): in headless Chromium the
 *    FontFace / document.fonts promises can fail to settle after Remotion
 *    recycles a render page, which would hang the whole render. Inline font
 *    data is parsed by the browser as part of layout, so `font-display: block`
 *    is enough to guarantee the glyphs are painted for every captured frame.
 *
 *   display: Quicksand (variable, playful/rounded)
 *   body:    Be Vietnam Pro (designed for Vietnamese)
 */
let injected = false;

export function ensureFonts(): void {
  if (injected || typeof document === "undefined") return;
  injected = true;

  const css = FONT_ENTRIES.map(
    (e) => `@font-face{font-family:'${e.family}';font-style:normal;font-weight:${e.weight};font-display:block;src:url(${e.dataUri}) format('truetype');}`,
  ).join("\n");

  const style = document.createElement("style");
  style.setAttribute("data-quizmotion-fonts", "true");
  style.textContent = css;
  document.head.appendChild(style);
}

ensureFonts();
