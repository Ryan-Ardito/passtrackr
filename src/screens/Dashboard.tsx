import { FormEvent, useState } from "react"

import { Divider } from "primereact/divider"

import { AddPass } from "./AddPass"
import { SearchBar } from "../components/SearchBar"
import { SearchResults } from "../components/SearchResults"
import { HolderData, HolderAction, Screen } from "../types"
import { searchPasses } from "../api/api";
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let res = searchPasses(search);
    setPassholders(await res);
    setLoading(false);
  }

  return (
    <div className="wrapper">
      <div className="dashboard">
        <SearchBar {...{ setSearch, handleSubmit, loading, }} />
        <div className="edit-box">
          <SearchResults {...{ passholders, selectedHolder, setSelectedHolder }} />
          <Divider layout="vertical" style={{ margin: 5 }} />
          {addPass ? (
            <AddPass {...{ selectedHolder, setAddPass }} />
          ) : (
            <PassInteraction {...{ selectedHolder, setScreen, setAddPass }} />
          )}
        </div>
      </div>
    </div>
  )
}