import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./AppContext";
import { PrimeReactProvider } from "primereact/api";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Dashboard } from "./screens/Dashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PrimeReactProvider>
        <AppProvider>
          {/* <AppContent /> */}
          <Dashboard />
          <ReactQueryDevtools />
        </AppProvider>
      </PrimeReactProvider>
    </QueryClientProvider>
  );
}

export default App;
