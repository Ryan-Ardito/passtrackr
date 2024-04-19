import { FormEvent, useState } from "react"

import { Divider } from "primereact/divider"

import { AddPass } from "./AddPass"
import { SearchBar } from "../components/SearchBar"
import { SearchResults } from "../components/SearchResults"
import { HolderData, HolderAction, Screen } from "../types"
import { fetchHolders } from "../api/api";
import { PassInteraction } from "../components/PassInteraction"

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

  return (
    <div className="wrapper">
      <div className="dashboard">
        <SearchBar setSearch={setSearch} handleSubmit={handleSubmit} />
        <div className="edit-box">
          <SearchResults
            passholders={passholders}
            selectedHolder={selectedHolder}
            setSelectedHolder={setSelectedHolder}
          />
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
  )
}