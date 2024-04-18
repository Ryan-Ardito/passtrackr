import { useState, useReducer } from "react";
import { listen } from '@tauri-apps/api/event'

import 'primeicons/primeicons.css';

import { Settings } from "./screens/Settings";
import { ViewPass } from "./screens/ViewPass";
import { About } from "./screens/About";
import { Dashboard } from "./screens/Dashboard";
import { HolderData, HolderAction, Msg, Screen, blankHolder } from "./types";

function holderReducer(holder: HolderData, action: HolderAction): HolderData {
  switch (action.type) {
    case Msg.Replace: { return action.data }
    case Msg.SetFirstName: { return { ...holder, first_name: action.data } }
    case Msg.SetLastName: { return { ...holder, last_name: action.data } }
    case Msg.SetTown: { return { ...holder, town: action.data } }
    case Msg.SetPasstype: { return { ...holder, passtype: action.data } }
    case Msg.SetActive: { return { ...holder, active: action.data } }
    case Msg.SetNotes: { return { ...holder, notes: action.data } }
  }
}

function App() {
  const [screen, setScreen] = useState(Screen.Dashboard);
  const [selectedHolder, setSelectedHolder] = useReducer(holderReducer, blankHolder);

  listen('dashboard', () => { setScreen(Screen.Dashboard) })
  listen('settings', () => { setScreen(Screen.Settings) })
  listen('about', () => { setScreen(Screen.About) })

  switch (screen) {
    case Screen.Dashboard:
      return <Dashboard
        setScreen={setScreen}
        selectedHolder={selectedHolder}
        setSelectedHolder={setSelectedHolder}
      />
    case Screen.ViewPass:
      return <ViewPass
        setScreen={setScreen}
        selectedHolder={selectedHolder}
        setSelectedHolder={setSelectedHolder}
      />
    case Screen.Settings:
      return <Settings setScreen={setScreen} />
    case Screen.About:
      return <About setScreen={setScreen} />
  }
}

export default App;