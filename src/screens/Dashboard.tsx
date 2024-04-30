import { Divider } from "primereact/divider";

import { SearchBar } from "../components/SearchBar";
import { SearchResults } from "../components/SearchResults";
import { useAppContext } from "../AppContext";
import { RightPanel } from "../components/side_panel/SidePanel";

export function Dashboard() {
  const { panel } = useAppContext();

  return (
    <div className="viewport-wrapper">
      <div id="dashboard" className="flex-box flex-col">
        <SearchBar />
        <div className="flex-box" style={{overflow: "hidden"}}>
          <SearchResults />
          <Divider layout="vertical" style={{ margin: 6 }} />
          <RightPanel {...{ panel }} />
        </div>
      </div>
    </div>
  );
}
