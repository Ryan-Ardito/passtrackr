import { invoke } from "@tauri-apps/api/tauri"
import { FormEvent, useState } from "react"

import { Divider } from "primereact/divider"
import { Button } from "primereact/button"

import { AddPass } from "./AddPass"
import { SearchBar } from "../components/SearchBar"
import { SearchResults } from "../components/SearchResults"
import { Screen } from "../App"

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
  passtype: {name: "annual", code: "Annual"},
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


interface ChildProps {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>,
  selectedHolder: HolderData,
  setSelectedHolder: React.Dispatch<HolderAction>,
}

export function Dashboard({setScreen, selectedHolder, setSelectedHolder}: ChildProps) {
  const [search, setSearch] = useState("");
  const [addPass, setAddPass] = useState(false);
  const [passholders, setPassholders] = useState<HolderData[]>([]);
  // const [selectedHolder, setSelectedHolder] = useReducer(holderReducer, blankHolder);

  async function fetchHolders() {
    setPassholders(await invoke("fetch_holders", {search: search}))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetchHolders();
  }

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

  return (
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
  )
}