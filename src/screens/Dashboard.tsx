import { Divider } from "primereact/divider";

import { SearchBar } from "../components/SearchBar";
import { SearchResults } from "../components/SearchResults";
import { useAppContext } from "../AppContext";
import { RightPanel } from "../components/side_panel/SidePanel";
import { Screen } from "../types";
import { ViewGuest } from "./ViewGuest";

const SearchInteraction = () => {
  const { panel } = useAppContext();

  return (
    <>
      <SearchResults />
      <Divider layout="vertical" style={{ margin: 6 }} />
      <RightPanel {...{ panel }} />
    </>
  );
};

export function Dashboard() {
  const { screen } = useAppContext();

  return (
    <div className="viewport-wrapper">
      <div id="dashboard" className="flex-box flex-col">
        <SearchBar />
        <div className="flex-box" style={{ overflow: "hidden" }}>
          {screen === Screen.Dashboard && <SearchInteraction />}
          {screen === Screen.ViewGuest && <ViewGuest />}
        </div>
      </div>
    </div>
  );
}
