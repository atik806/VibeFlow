import { AppProviders } from "@/map-poster/core/AppProviders";
import AppShell from "@/map-poster/shared/ui/AppShell";

export default function App() {
  return (
    <AppProviders>
      <AppShell />
    </AppProviders>
  );
}
