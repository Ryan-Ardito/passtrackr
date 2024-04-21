import { useEffect } from "react";

import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";

import { SearchBar } from "../components/SearchBar";
import { SearchResults } from "../components/SearchResults";
import { Msg, blankPass } from "../types";
import { showMessage } from "../utils/toast";
import { useAppContext } from "../AppContext";
import { RightPanel } from "../components/SidePanel";

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

  return (
    <div className="viewport-wrapper">
      <div id="dashboard" className="flex-box flex-col flex-2 ">
        <Toast ref={toast} position="top-center" />
        <SearchBar />
        <div className="flex-box flex-row">
          <SearchResults />
          <Divider layout="vertical" style={{ margin: 5 }} />
          <RightPanel {...{ panel }} />
        </div>
      </div>
    </div>
  );
}
