import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";

import { SearchBar } from "../components/SearchBar";
import { SearchResults } from "../components/SearchResults";
import { useAppContext } from "../AppContext";
import { RightPanel } from "../components/side_panel/SidePanel";

export function Dashboard() {
  const { panel, toast } = useAppContext();

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
