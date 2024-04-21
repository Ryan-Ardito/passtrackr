import { AppContent, AppProvider } from "./AppContext";

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
