import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppContent, AppProvider } from "./AppContext";
import { PrimeReactProvider } from "primereact/api";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

function App() {
  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <PrimeReactProvider>
          <AppContent />
          <ReactQueryDevtools />
        </PrimeReactProvider>
      </QueryClientProvider>
    </AppProvider>
  );
}

export default App;
