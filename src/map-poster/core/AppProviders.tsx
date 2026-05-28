import type { ReactNode } from "react";
import { PosterProvider } from "@/map-poster/features/poster/ui/PosterContext";

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Wraps the application in all required context providers.
 * Add new providers here as needed.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return <PosterProvider>{children}</PosterProvider>;
}
