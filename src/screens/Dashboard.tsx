import { FormEvent, useState } from "react"

import { Divider } from "primereact/divider"
import { Button } from "primereact/button"

import { AddPass } from "./AddPass"
import { SearchBar } from "../components/SearchBar"
import { SearchResults } from "../components/SearchResults"
import { HolderData, HolderAction, Screen } from "../App"
import { fetchHolders } from "../api/api";

interface ChildProps {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>,
  selectedHolder: HolderData,
  setSelectedHolder: React.Dispatch<HolderAction>,
}

export function Dashboard({ setScreen, selectedHolder, setSelectedHolder }: ChildProps) {
  const [search, setSearch] = useState("");
  const [addPass, setAddPass] = useState(false);
  const [passholders, setPassholders] = useState<HolderData[]>([]);
  // const [selectedHolder, setSelectedHolder] = useReducer(holderReducer, blankHolder);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let res = fetchHolders(search);
    setPassholders(await res);
  }

  function PassInteraction() {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: 1 }}>
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
        <SearchBar setSearch={setSearch} handleSubmit={handleSubmit} />
        <div className="edit-box">
          <SearchResults passholders={passholders} selectedHolder={selectedHolder} setSelectedHolder={setSelectedHolder} />
          <Divider layout="vertical" style={{ margin: 5 }} />
          {addPass ? <AddPass selectedHolder={selectedHolder} setSelectedHolder={setSelectedHolder} setAddPass={setAddPass} /> : <PassInteraction />}
        </div>
      </div>
    </div>
  )
}