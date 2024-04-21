import { useState, useReducer, createContext, useContext } from "react";
import { listen } from "@tauri-apps/api/event";

import "primeicons/primeicons.css";

import { Settings } from "./screens/Settings";
import { ViewPass } from "./screens/ViewPass";
import { About } from "./screens/About";
import { Dashboard } from "./screens/Dashboard";
import { PassData, PassAction, Msg, Screen, blankPass } from "./types";

interface AppContextProps {
  screen: Screen;
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  selectedPass: PassData;
  setSelectedPass: React.Dispatch<PassAction>;
}

export const AppContext = createContext<Partial<AppContextProps>>({});

function passReducer(passData: PassData, action: PassAction): PassData {
  switch (action.type) {
    case Msg.Replace:
      return action.data;
    case Msg.SetFirstName:
      return { ...passData, first_name: action.data };
    case Msg.SetLastName:
      return { ...passData, last_name: action.data };
    case Msg.SetTown:
      return { ...passData, town: action.data };
    case Msg.SetPasstype:
      return { ...passData, passtype: action.data };
    case Msg.SetActive:
      return { ...passData, active: action.data };
    case Msg.SetNotes:
      return { ...passData, notes: action.data };
  }
}

function AppProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = useState(Screen.Dashboard);
  const [selectedPass, setSelectedPass] = useReducer(passReducer, blankPass);

  // Window menu emissions from Tauri
  listen("dashboard", () => setScreen(Screen.Dashboard));
  listen("settings", () => setScreen(Screen.Settings));
  listen("about", () => setScreen(Screen.About));

  return (
    <AppContext.Provider
      value={{ screen, setScreen, selectedPass, setSelectedPass }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextProps {
  const context = useContext(AppContext) as AppContextProps;
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

function AppContent() {
  const { screen } = useAppContext();

  return (
    <>
      {screen === Screen.Dashboard && <Dashboard />}
      {screen === Screen.ViewPass && <ViewPass />}
      {screen === Screen.Settings && <Settings />}
      {screen === Screen.About && <About />}
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
