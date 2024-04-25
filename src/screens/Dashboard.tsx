import { useEffect } from "react";

import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";

import { SearchBar } from "../components/SearchBar";
import { SearchResults } from "../components/SearchResults";
import { blankPass } from "../types";
import { showMessage } from "../utils/toast";
import { useAppContext } from "../AppContext";
import { RightPanel } from "../components/side_panel/SidePanel";

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

  useEffect(() => {
    setSelectedPass(blankPass);
  }, [searchData]);

  return (
    <div className="viewport-wrapper">
      <div id="dashboard" className="h-full flex-box flex-col">
        <Toast ref={toast} position="bottom-left" />
        <SearchBar />
        <div className="h-full flex-box">
          <SearchResults />
          <Divider layout="vertical" style={{ margin: 6 }} />
          <RightPanel {...{ panel }} />
        </div>
      </div>
    </div>
  );
}
