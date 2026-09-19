"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { useEffect, useState } from "react";

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
        variables: isDark
          ? {
              colorBackground: "#0a0a0a",
              colorForeground: "#ededed",
              colorInput: "#171717",
              colorInputForeground: "#ededed",
            }
          : undefined,
      }}
    >
      {children}
    </ClerkProvider>
  );
}
