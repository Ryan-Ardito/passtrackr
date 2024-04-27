import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider, useAppContext } from "./AppContext";
import { PrimeReactProvider } from "primereact/api";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Screen } from "./types";
import { Dashboard } from "./screens/Dashboard";
import { ViewGuest } from "./screens/ViewGuest";
import { Settings } from "./screens/Settings";
import { About } from "./screens/About";

const queryClient = new QueryClient();

export function AppContent() {
  const { screen } = useAppContext();

  return (
    <>
      {screen === Screen.Dashboard && <Dashboard />}
      {screen === Screen.ViewGuest && <ViewGuest />}
      {screen === Screen.Settings && <Settings />}
      {screen === Screen.About && <About />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PrimeReactProvider>
        <AppProvider>
          <AppContent />
          <ReactQueryDevtools />
        </AppProvider>
      </PrimeReactProvider>
    </QueryClientProvider>
  );
}

export default App;
