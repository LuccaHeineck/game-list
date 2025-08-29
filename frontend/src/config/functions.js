export const ratingColors = [
  "#ef4444",
  "#f59e0b",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
];

export function hexToRgb(hex) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3)
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  const num = parseInt(hex, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

export function interpolateColor(value) {
  const maxIndex = ratingColors.length - 1;
  const scaled = (value / 10) * maxIndex;
  const indexLow = Math.floor(scaled);
  const indexHigh = Math.min(Math.ceil(scaled), maxIndex);
  const ratio = scaled - indexLow;

  const color1 = hexToRgb(ratingColors[indexLow]);
  const color2 = hexToRgb(ratingColors[indexHigh]);

  const r = Math.round(color1.r + (color2.r - color1.r) * ratio);
  const g = Math.round(color1.g + (color2.g - color1.g) * ratio);
  const b = Math.round(color1.b + (color2.b - color1.b) * ratio);

  return `rgb(${r},${g},${b})`;
}
