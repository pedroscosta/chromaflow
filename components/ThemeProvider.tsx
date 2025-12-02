"use client";

// biome-ignore lint/style/useFilenamingConvention: component name matches React conventions
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => (
  <NextThemesProvider {...props}>{children}</NextThemesProvider>
);
