import { listen } from "@tauri-apps/api/event";
import {
  useState,
  createContext,
  useContext,
  useRef,
  Dispatch,
  SetStateAction,
  RefObject,
} from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { DebouncedFunc, debounce } from "lodash";

import { Toast } from "primereact/toast";
import "primeicons/primeicons.css";

import { PassData, Screen, blankPass, Panel } from "./types";
import { searchPasses } from "./api/api";

interface AppContextProps {
  screen: Screen;
  setScreen: Dispatch<SetStateAction<Screen>>;
  selectedPass: PassData;
  setSelectedPass: Dispatch<SetStateAction<PassData>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  debouncedSetSearch: DebouncedFunc<Dispatch<SetStateAction<string>>>;
  panel: Panel;
  setPanel: Dispatch<SetStateAction<Panel>>;
  searchData: PassData[];
  isSearchFetching: boolean;
  searchStatus: "error" | "success" | "pending";
  isSearchSuccess: boolean;
  searchError: Error | null;
  toast: RefObject<Toast>;
}

const AppContext = createContext<Partial<AppContextProps>>({});

export function useAppContext(): AppContextProps {
  const context = useContext(AppContext) as AppContextProps;
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = useState(Screen.Dashboard);
  const [selectedPass, setSelectedPass] = useState(blankPass);

  const [search, setSearch] = useState("");
  const debouncedSetSearch = debounce(setSearch, 400);
  const [panel, setPanel] = useState(Panel.PassInteraction);

  const {
    data: searchData,
    isFetching: isSearchFetching,
    status: searchStatus,
    isSuccess: isSearchSuccess,
    error: searchError,
  } = useQuery({
    queryKey: ["search", search],
    queryFn: () => ((search.length > 2) ? searchPasses(search) : []),
    placeholderData: keepPreviousData,
    staleTime: 120_000,
  });

  const toast = useRef<Toast>(null);

  // Window menu emissions from Tauri
  listen("dashboard", () => setScreen(Screen.Dashboard));
  listen("settings", () => setScreen(Screen.Settings));
  listen("about", () => setScreen(Screen.About));

  const contextValues = {
    screen,
    setScreen,
    selectedPass,
    setSelectedPass,
    search,
    setSearch,
    debouncedSetSearch,
    panel,
    setPanel,
    searchData,
    isSearchFetching,
    searchStatus,
    isSearchSuccess,
    searchError,
    toast,
  };

  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  );
}
