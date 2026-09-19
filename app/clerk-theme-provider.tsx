"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { useEffect, useState } from "react";

// Clerk renders its own UI, so its palette has to be told about dark mode
// separately from the CSS variables the rest of the app uses.
const DARK_VARIABLES = {
  colorBackground: "#121215",
  colorForeground: "#fafafa",
  colorMutedForeground: "#a1a1aa",
  colorInput: "#1c1c20",
  colorInputForeground: "#fafafa",
  colorNeutral: "white",
};

export function ClerkThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(media.matches);

    const listener = (event: MediaQueryListEvent) => setIsDark(event.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  return (
    <ClerkProvider
      appearance={{
        variables: isDark ? DARK_VARIABLES : undefined,
        elements: { organizationSwitcherTrigger: "text-sm" },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
