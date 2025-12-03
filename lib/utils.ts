import { type ClassValue, clsx } from "clsx";
import Color from "colorjs.io";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatOklch = (colorString: string): string => {
  try {
    const color = new Color(colorString);
    const oklch = color.oklch;
    // Format: oklch(l c h) where l is 0-1 decimal, c is decimal, h is degrees
    return `oklch(${oklch.l.toPrecision(3)} ${oklch.c.toPrecision(3)} ${(oklch.h ?? 0).toPrecision(0)})`;
  } catch {
    return colorString;
  }
};
