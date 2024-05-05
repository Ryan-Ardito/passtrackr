import { Divider } from "primereact/divider";

import { SearchBar } from "../components/SearchBar";
import { SearchResults } from "../components/SearchResults";
import { useAppContext } from "../AppContext";
import { RightPanel } from "../side_panel/SidePanel";
import { Screen } from "../types";
import { ViewGuest } from "./ViewGuest";
import { ViewPass } from "./ViewPass";

const SearchInteraction = () => {
  const { panel } = useAppContext();

  return (
    <div className="flex-box">
      <SearchResults />
      <Divider layout="vertical" style={{ margin: 6 }} />
      <RightPanel {...{ panel }} />
    </div>
  );
};

export function Dashboard() {
  const { screen, setScreen } = useAppContext();

  return (
    <div className="viewport-wrapper">
      <div id="dashboard" className="flex-box flex-col">
        <SearchBar />
        {screen === Screen.Dashboard && <SearchInteraction />}
        {screen === Screen.ViewGuest && (
          <ViewGuest prevPage={() => setScreen(Screen.Dashboard)} />
        )}
        {screen === Screen.ViewPass && (
          <ViewPass prevPage={() => setScreen(Screen.Dashboard)} />
        )}
      </div>
    </div>
  );
}
