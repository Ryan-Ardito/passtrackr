import { useState, FormEvent, useReducer } from "react";
// import { Dispatch, SetStateAction, createContext, ReactNode, useContext } from "react";
import { invoke } from "@tauri-apps/api/tauri";

import { SearchBar } from "./components/SearchBar";
import { PassInfo } from "./components/PassInfo";
import { SearchResults } from "./components/SearchResults";

import { Button } from 'primereact/button';

import 'primeicons/primeicons.css';
import { Divider } from "primereact/divider";
import { AddPass } from "./screens/AddPass";

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

export type HolderAction =
  | { type: "replace"; data: HolderData }
  | { type: "set_first_name"; data: string }
  | { type: "set_last_name"; data: string }
  | { type: "set_town"; data: string }
  | { type: "set_passtype"; data: PassType | null }
  | { type: "set_active"; data: boolean }
  | { type: "set_notes"; data: string }

export enum Screen {
  Dashboard,
  // AddPass,
  ViewPass,
}

function holderReducer(holder: HolderData, action: HolderAction): HolderData {
  switch (action.type) {
    case "replace": {
      return action.data
    }
    case "set_first_name": {
      return { ...holder,
        first_name: action.data, }
    }
    case "set_last_name": {
      return { ...holder,
        last_name: action.data, }
    }
    case "set_town": {
      return { ...holder,
        town: action.data, }
    }
    case "set_passtype": {
      return { ...holder,
        passtype: action.data, }
    }
    case "set_active": {
      return { ...holder,
        active: action.data, }
    }
    case "set_notes": {
      return { ...holder,
        notes: action.data, }
    }
  }
}

function App() {
  const [search, setSearch] = useState("");
  const [screen, setScreen] = useState(Screen.Dashboard);
  const [addPass, setAddPass] = useState(false);
  const [passholders, setPassholders] = useState<HolderData[]>([]);
  const [selectedHolder, setSelectedHolder] = useReducer(holderReducer, blankHolder);

  async function fetchHolders() {
    setPassholders(await invoke("fetch_holders", {search: search}))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetchHolders();
  }
  
  // const NewPass = 
  //   <div className="wrapper">
  //     <Button label="Dashboard" onClick={(e) => {
  //       e.preventDefault();
  //       setScreen(Screen.Dashboard);
  //     }} />
  //     <AddPass selectedHolder={selectedHolder} setSelectedHolder={setSelectedHolder} />
  //   </div>

  function PassInteraction() {
    return (
      <div style={{display: "flex", flexDirection: "column", gap: "5px", flex: 1}}>
        <Button disabled={!selectedHolder.id} label="Log Visit" onClick={(e) => {
            e.preventDefault();
        }} />
        <Button disabled={!selectedHolder.id} label="Add Visits" onClick={(e) => {
            e.preventDefault();
        }} />
        <Button disabled={!selectedHolder.id} label="View Pass" onClick={(e) => {
            e.preventDefault();
            setScreen(Screen.ViewPass);
        }} />
        <Divider />
        <Button label="New Pass" onClick={(e) => {
            e.preventDefault();
            setAddPass(true);
            // setScreen(Screen.AddPass);
        }} />
      </div>
    )
  }

  const Dashboard = 
    <div className="wrapper">
      <div className="container">
        <SearchBar setSearch={setSearch} handleSubmit={handleSubmit}/>
        <div className="edit-box">
          <SearchResults passholders={passholders} selectedHolder={selectedHolder} setSelectedHolder={setSelectedHolder}/>
          <Divider layout="vertical" style={{margin: 5}}/>
          {addPass ? <AddPass selectedHolder={selectedHolder} setSelectedHolder={setSelectedHolder} setAddPass={setAddPass}/> : <PassInteraction />}
        </div>
      </div>
    </div>
  
  const ViewPass = 
    <div className="wrapper">
      <div className="container">
        <PassInfo selectedHolder={selectedHolder} setSelectedHolder={setSelectedHolder} />
        <Button label="Back" onClick={(e) => {
            e.preventDefault();
            setScreen(Screen.Dashboard);
        }} />
      </div>
    </div>
  
  switch (screen) {
    case Screen.Dashboard:
      return Dashboard;
    // case Screen.AddPass:
    //   return NewPass;
    case Screen.ViewPass:
      return ViewPass;
  }
}

export default App;