import { JSX } from "react";
import { renderToStaticMarkup } from "react-dom/server";

export function createSvgIconImage(icon: JSX.Element) {
  const svg = renderToStaticMarkup(icon);
  const dataUrl = "data:image/svg+xml;base64," + btoa(svg);
  const image = new window.Image();
  image.src = dataUrl;

  return image;
}
