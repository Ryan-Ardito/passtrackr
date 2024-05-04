import {
  useState,
  createContext,
  useContext,
  useRef,
  Dispatch,
  SetStateAction,
  RefObject,
  useEffect,
} from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { Toast } from "primereact/toast";
import "primeicons/primeicons.css";

import { PassData, Screen, blankPass, SidePanel, GuestData } from "./types";
import { searchPasses } from "./api/api";
import { showMessage } from "./utils/toast";
import { message } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api";

const MIN_SEARCH_LENGTH = 2;

interface AppContextProps {
  screen: Screen;
  setScreen: Dispatch<SetStateAction<Screen>>;
  selectedPass: PassData;
  setSelectedPass: Dispatch<SetStateAction<PassData>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  panel: SidePanel;
  setPanel: Dispatch<SetStateAction<SidePanel>>;
  searchData: PassData[];
  guestData: GuestData | undefined;
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
  const [panel, setPanel] = useState(SidePanel.PassInteraction);

  const {
    data: searchData,
    isFetching: isSearchFetching,
    status: searchStatus,
    isSuccess: isSearchSuccess,
    error: searchError,
  } = useQuery({
    queryKey: ["search", search],
    queryFn: () =>
      search.length >= MIN_SEARCH_LENGTH ? searchPasses(search) : [],
    placeholderData: keepPreviousData,
  });

  const toast = useRef<Toast>(null);

  useEffect(() => {
    invoke("was_config_error").then((e) => {
      if (e) {
        message("Unable to read config.json!");
      }
    });
  }, []);

  useEffect(() => {
    if (searchError && searchStatus === "error") {
      showMessage(searchError.name, searchError.message, toast, "warn");
    }
  }, [searchStatus]);

  useEffect(() => {
    setSelectedPass(blankPass);
    setScreen(Screen.Dashboard);
    setPanel(SidePanel.PassInteraction);
  }, [search]);

  const contextValues = {
    screen,
    setScreen,
    selectedPass,
    setSelectedPass,
    search,
    setSearch,
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
    <AppContext.Provider value={contextValues}>
      <Toast ref={toast} position="bottom-right" />
      {children}
    </AppContext.Provider>
  );
}
