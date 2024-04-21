import { listen } from "@tauri-apps/api/event";
import {
  useState,
  useReducer,
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

import { PassData, PassAction, Msg, Screen, blankPass, Panel } from "./types";
import { searchPasses } from "./api/api";

function passReducer(passData: PassData, action: PassAction): PassData {
  switch (action.type) {
    case Msg.Replace:
      return action.data;
    case Msg.SetFirstName:
      return { ...passData, first_name: action.data };
    case Msg.SetLastName:
      return { ...passData, last_name: action.data };
    case Msg.SetTown:
      return { ...passData, town: action.data };
    case Msg.SetPasstype:
      return { ...passData, passtype: action.data };
    case Msg.SetActive:
      return { ...passData, active: action.data };
    case Msg.SetNotes:
      return { ...passData, notes: action.data };
  }
}

interface AppContextProps {
  screen: Screen;
  setScreen: Dispatch<SetStateAction<Screen>>;
  selectedPass: PassData;
  setSelectedPass: Dispatch<PassAction>;
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

export const AppContext = createContext<Partial<AppContextProps>>({});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = useState(Screen.Dashboard);
  const [selectedPass, setSelectedPass] = useReducer(passReducer, blankPass);

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
    queryFn: () => (search ? searchPasses(search) : []),
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

export function useAppContext(): AppContextProps {
  const context = useContext(AppContext) as AppContextProps;
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
