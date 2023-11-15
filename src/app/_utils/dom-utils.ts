import tinycolor from "tinycolor2";

/**
 * Takes and element and returns it's background color.
 * If background color is transparent or inherit, it will return the parent's background color.
 */
export function getNodeBackgroundColor(element: HTMLElement): string {
  if (typeof window === "undefined") return "#00000000";

  const backgroundColor = getComputedStyle(element).backgroundColor;
  const isTransparent =
    backgroundColor === "transparent" ||
    backgroundColor === "inherit" ||
    backgroundColor === null ||
    backgroundColor === undefined ||
    tinycolor(backgroundColor).getAlpha() === 0;

  return isTransparent
    ? getNodeBackgroundColor(element.parentElement ?? document.body)
    : backgroundColor;
}
