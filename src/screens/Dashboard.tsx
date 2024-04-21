import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";

import { Divider } from "primereact/divider";

import { AddPass } from "./AddPass";
import { SearchBar } from "../components/SearchBar";
import { SearchResults } from "../components/SearchResults";
import { PassData, PassAction, Screen, Msg, blankPass, Panel } from "../types";
import { searchPasses } from "../api/api";
import { PassControl } from "../components/PassInteraction";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Toast } from "primereact/toast";
import { showMessage } from "../utils/toast";

interface ChildProps {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  selectedPass: PassData;
  setSelectedPass: React.Dispatch<PassAction>;
}

export function Dashboard({
  setScreen,
  selectedPass,
  setSelectedPass,
}: ChildProps) {
  const [search, setSearch] = useState("");
  const debouncedSetSearch = debounce(setSearch, 400);
  const [panel, setPanel] = useState(Panel.PassInteraction);

  const { data, isFetching, status, isSuccess, error } = useQuery({
    queryKey: ["search", search],
    queryFn: () => (search ? searchPasses(search) : []),
    placeholderData: keepPreviousData,
    staleTime: 120_000,
  });

  const toast = useRef<Toast>(null);
  useEffect(() => {
    if (status === "error") {
      showMessage(error.name, error.message, toast, "warn");
    }
  }, [status]);

  // KLUDGE. possibly only an issue on dev.
  // without it, a pass can remain selected with empty search results.
  if (data?.length == 0)
    setSelectedPass({ type: Msg.Replace, data: blankPass });

  const RightPanel = () => {
    return (
      <>
        {panel === Panel.AddPass && (
          <AddPass {...{ selectedPass, setPanel, isSuccess, toast }} />
        )}
        {panel === Panel.PassInteraction && (
          <PassControl {...{ selectedPass, setScreen, setPanel, toast }} />
        )}
      </>
    );
  };

  return (
    <div className="wrapper">
      <div className="dashboard">
        <Toast ref={toast} position="top-center" />
        <SearchBar
          {...{ setSearch: debouncedSetSearch, loading: isFetching }}
        />
        <div className="edit-box">
          <SearchResults
            {...{
              passes: data,
              selectedPass: selectedPass,
              setSelectedPass,
            }}
          />
          <Divider layout="vertical" style={{ margin: 5 }} />
          <RightPanel />
        </div>
      </div>
    </div>
  );
}
