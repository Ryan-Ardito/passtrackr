import { useEffect } from "react";

import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";

import { AddPass } from "./AddPass";
import { SearchBar } from "../components/SearchBar";
import { SearchResults } from "../components/SearchResults";
import { Msg, blankPass, Panel } from "../types";
import { PassControl } from "../components/PassInteraction";
import { showMessage } from "../utils/toast";
import { useAppContext } from "../AppContext";

export function Dashboard() {
  const {
    setSelectedPass,
    panel,
    searchData,
    searchStatus,
    searchError,
    toast,
  } = useAppContext();

  useEffect(() => {
    if (searchError && searchStatus === "error") {
      showMessage(searchError.name, searchError.message, toast, "warn");
    }
  }, [searchStatus]);

  // KLUDGE. possibly only an issue on dev.
  // without it, a pass can remain selected with empty search results.
  if (searchData?.length == 0)
    setSelectedPass({ type: Msg.Replace, data: blankPass });

  const RightPanel = () => {
    return (
      <>
        {panel === Panel.AddPass && <AddPass />}
        {panel === Panel.PassInteraction && <PassControl />}
      </>
    );
  };

  return (
    <div className="wrapper">
      <div className="dashboard">
        <Toast ref={toast} position="top-center" />
        <SearchBar />
        <div className="edit-box">
          <SearchResults />
          <Divider layout="vertical" style={{ margin: 5 }} />
          <RightPanel />
        </div>
      </div>
    </div>
  );
}
