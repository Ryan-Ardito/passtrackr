import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";

import { Divider } from "primereact/divider"

import { AddPass } from "./AddPass"
import { SearchBar } from "../components/SearchBar"
import { SearchResults } from "../components/SearchResults"
import { PassData, PassAction, Screen, Msg, blankPass } from "../types"
import { searchPasses } from "../api/api";
import { PassInteraction } from "../components/PassInteraction"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Toast, ToastMessage } from "primereact/toast";

interface ChildProps {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>,
  selectedPass: PassData,
  setSelectedPass: React.Dispatch<PassAction>,
}

export function Dashboard({ setScreen, selectedPass, setSelectedPass }: ChildProps) {
  const [search, setSearch] = useState("");
  const debouncedSetSearch = debounce(setSearch, 350);
  const [addPass, setAddPass] = useState(false);

  const { data, isFetching, status } = useQuery({
    queryKey: ["search", search],
    queryFn: () => (search ? searchPasses(search) : []),
    placeholderData: keepPreviousData,
    staleTime: 120_000,
  })

  const toast = useRef<Toast>(null);
  const showMessage = (summary: string, detail: string, ref: React.RefObject<Toast>, severity: ToastMessage['severity']) => {
    ref.current?.show({...{ severity, summary, detail, life: 6500 }});
  };
  useEffect(() => {
    if (status === "error") {
      showMessage("Network problem", "Unable to connect to database", toast, "warn");
    }
  }, [status]);

  // KLUDGE. possibly only an issue on dev
  if (data?.length == 0) setSelectedPass({ type: Msg.Replace, data: blankPass })

  return (
    <div className="wrapper">
      <div className="dashboard">
        <Toast ref={toast} position="bottom-center" />
        <SearchBar {...{ setSearch: debouncedSetSearch, loading: isFetching, }} />
        <div className="edit-box">
          <SearchResults {...{ passes: data, selectedPass: selectedPass, setSelectedPass: setSelectedPass }} />
          <Divider layout="vertical" style={{ margin: 5 }} />
          {addPass ? (
            <AddPass {...{ selectedPass, setAddPass }} />
          ) : (
            <PassInteraction {...{ selectedPass, setScreen, setAddPass }} />
          )}
        </div>
      </div>
    </div>
  )
}