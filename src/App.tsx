import { useState, useReducer } from "react";
import { listen } from "@tauri-apps/api/event";

import "primeicons/primeicons.css";

import { Settings } from "./screens/Settings";
import { ViewPass } from "./screens/ViewPass";
import { About } from "./screens/About";
import { Dashboard } from "./screens/Dashboard";
import { PassData, PassAction, Msg, Screen, blankPass } from "./types";

function passReducer(pass_data: PassData, action: PassAction): PassData {
  switch (action.type) {
    case Msg.Replace:
      return action.data;
    case Msg.SetFirstName:
      return { ...pass_data, first_name: action.data };
    case Msg.SetLastName:
      return { ...pass_data, last_name: action.data };
    case Msg.SetTown:
      return { ...pass_data, town: action.data };
    case Msg.SetPasstype:
      return { ...pass_data, passtype: action.data };
    case Msg.SetActive:
      return { ...pass_data, active: action.data };
    case Msg.SetNotes:
      return { ...pass_data, notes: action.data };
  }
}

function App() {
  const [screen, setScreen] = useState(Screen.Dashboard);
  const [selectedPass, setSelectedPass] = useReducer(passReducer, blankPass);

  // Window menu emissions from Tauri
  listen("dashboard", () => setScreen(Screen.Dashboard));
  listen("settings", () => setScreen(Screen.Settings));
  listen("about", () => setScreen(Screen.About));

  switch (screen) {
    case Screen.Dashboard:
      return <Dashboard {...{ setScreen, selectedPass, setSelectedPass }} />;
    case Screen.ViewPass:
      return <ViewPass {...{ setScreen, selectedPass, setSelectedPass }} />;
    case Screen.Settings:
      return <Settings {...{ setScreen }} />;
    case Screen.About:
      return <About {...{ setScreen }} />;
  }
}

export default App;
