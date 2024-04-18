import { useState, FormEvent, useReducer } from "react";
import { listen } from '@tauri-apps/api/event'

import 'primeicons/primeicons.css';
import { Divider } from "primereact/divider";

import { fetchHolders } from "./api/api";
import { SearchBar } from "./components/SearchBar";
import { SearchResults } from "./components/SearchResults";
import { PassInteraction } from "./components/PassInteraction";
import { AddPass } from "./screens/AddPass";
import { Settings } from "./screens/Settings";
import { ViewPass } from "./screens/ViewPass";
import { About } from "./screens/About";

export enum Screen {
  Dashboard,
  ViewPass,
  Settings,
  About,
}

export interface PassType {
  name: string,
  code: string,
}

export interface HolderData {
  id: number | null,
  first_name: string,
  last_name: string,
  town: string,
  remaining: number,
  passtype: PassType | null,
  active: boolean,
  notes: string,
}

export const blankHolder: HolderData = {
  id: null,
  first_name: "",
  last_name: "",
  town: "",
  remaining: 0,
  passtype: null,
  active: false,
  notes: "",
}

export enum Msg {
  Replace = "REPLACE",
  SetFirstName = "SET_FIRST_NAME",
  SetLastName = "SET_LAST_NAME",
  SetTown = "SET_TOWN",
  SetPasstype = "SET_PASSTYPE",
  SetActive = "SET_ACTIVE",
  SetNotes = "SET_NOTES",
}

export type HolderAction =
  | { type: Msg.Replace; data: HolderData }
  | { type: Msg.SetFirstName; data: string }
  | { type: Msg.SetLastName; data: string }
  | { type: Msg.SetTown; data: string }
  | { type: Msg.SetPasstype; data: PassType | null }
  | { type: Msg.SetActive; data: boolean }
  | { type: Msg.SetNotes; data: string }

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
  const [search, setSearch] = useState("");
  const [screen, setScreen] = useState(Screen.Dashboard);
  const [addPass, setAddPass] = useState(false);
  const [passholders, setPassholders] = useState<HolderData[]>([]);
  const [selectedHolder, setSelectedHolder] = useReducer(holderReducer, blankHolder);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let res = fetchHolders(search);
    setPassholders(await res);
  }

  const Dashboard =
    <div className="wrapper">
      <div className="container">
        <SearchBar setSearch={setSearch} handleSubmit={handleSubmit} />
        <div className="edit-box">
          <SearchResults passholders={passholders} selectedHolder={selectedHolder} setSelectedHolder={setSelectedHolder} />
          <Divider layout="vertical" style={{ margin: 5 }} />
          {addPass ? (
            <AddPass
              selectedHolder={selectedHolder}
              setSelectedHolder={setSelectedHolder}
              setAddPass={setAddPass} />
          ) : (
            <PassInteraction
              selectedHolder={selectedHolder}
              setScreen={setScreen}
              setAddPass={setAddPass} />
          )}
        </div>
      </div>
    </div>

  listen('settings', () => { setScreen(Screen.Settings) })
  listen('about', () => { setScreen(Screen.About) })

  switch (screen) {
    case Screen.Dashboard:
      return Dashboard;
    case Screen.ViewPass:
      return ViewPass({ setScreen, selectedHolder, setSelectedHolder });
    case Screen.Settings:
      return Settings({ setScreen });
    case Screen.About:
      return About({ setScreen });
  }
}

export default App;