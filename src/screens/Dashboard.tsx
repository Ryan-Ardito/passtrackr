import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";

import { Divider } from "primereact/divider"

import { AddPass } from "./AddPass"
import { SearchBar } from "../components/SearchBar"
import { SearchResults } from "../components/SearchResults"
import { HolderData, HolderAction, Screen, Msg, blankHolder } from "../types"
import { searchPasses } from "../api/api";
import { PassInteraction } from "../components/PassInteraction"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Toast, ToastMessage } from "primereact/toast";

interface ChildProps {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>,
  selectedHolder: HolderData,
  setSelectedHolder: React.Dispatch<HolderAction>,
}

export function Dashboard({ setScreen, selectedHolder, setSelectedHolder }: ChildProps) {
  const [search, setSearch] = useState("");
  const debouncedSetSearch = debounce(setSearch, 350);
  const [addPass, setAddPass] = useState(false);

  const { data, isFetching, status } = useQuery({
    queryKey: ["search", search],
    queryFn: () => { if (search) { return searchPasses(search); } else { return []; } },
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  })

  const toast = useRef<Toast>(null);
  const showMessage = (summary: string, detail: string, ref: React.RefObject<Toast>, severity: ToastMessage['severity']) => {
    ref.current?.show({...{ severity, summary, detail, life: 6000 }});
  };
  useEffect(() => {
    if (status === "error") {
      showMessage("Network problem", "Unable to connect to database", toast, "warn");
    }
  }, [status]);

  // KLUDGE. possibly only an issue on dev
  if (data?.length == 0) setSelectedHolder({ type: Msg.Replace, data: blankHolder })

  return (
    <div className="wrapper">
      <div className="dashboard">
        <Toast ref={toast} position="bottom-center" />
        <SearchBar {...{ setSearch: debouncedSetSearch, loading: isFetching, }} />
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