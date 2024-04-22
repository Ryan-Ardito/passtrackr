import { useEffect } from "react";

import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";

import { SearchBar } from "../components/SearchBar";
import { SearchResults } from "../components/SearchResults";
import { blankPass } from "../types";
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
    setSelectedPass(blankPass );

  return (
    <div className="viewport-wrapper">
      <div id="dashboard" className="flex-box flex-col">
        <Toast ref={toast} position="bottom-right" />
        <SearchBar />
        <div className="flex-box">
          <SearchResults />
          <Divider layout="vertical" style={{ margin: 6 }} />
          <RightPanel {...{ panel }} />
        </div>
      </div>
    </div>
  );
}
