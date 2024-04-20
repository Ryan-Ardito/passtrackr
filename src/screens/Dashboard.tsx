import { useState } from "react";
import { debounce } from "lodash";

import { Divider } from "primereact/divider"

import { AddPass } from "./AddPass"
import { SearchBar } from "../components/SearchBar"
import { SearchResults } from "../components/SearchResults"
import { HolderData, HolderAction, Screen } from "../types"
import { searchPasses } from "../api/api";
import { PassInteraction } from "../components/PassInteraction"
import { useQuery } from "@tanstack/react-query"

interface ChildProps {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>,
  selectedHolder: HolderData,
  setSelectedHolder: React.Dispatch<HolderAction>,
}

export function Dashboard({ setScreen, selectedHolder, setSelectedHolder }: ChildProps) {
  const [search, setSearch] = useState("");
  const debouncedSetSearch = debounce(setSearch, 350);
  const [addPass, setAddPass] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["search", search],
    queryFn: () => searchPasses(search)
  })

  return (
    <div className="wrapper">
      <div className="dashboard">
        <SearchBar {...{ setSearch: debouncedSetSearch, loading: isLoading, }} />
        <div className="edit-box">
          <SearchResults {...{ passholders: data, selectedHolder, setSelectedHolder }} />
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