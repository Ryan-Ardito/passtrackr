import { listen } from "@tauri-apps/api/event";
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
import { getGuest, searchPasses } from "./api/api";
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

  const { data: guestData } = useQuery({
    queryKey: ["guest", selectedPass.guest_id],
    queryFn: () => getGuest(selectedPass.guest_id),
  });

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
        message("Could not read config.json!");
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

  // Window menu emissions from Tauri
  listen("dashboard", () => setScreen(Screen.Dashboard));
  listen("settings", () => setScreen(Screen.Settings));
  listen("about", () => setScreen(Screen.About));
  listen("config", () => message("Error reading config.json"));

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
    guestData,
    isSearchFetching,
    searchStatus,
    isSearchSuccess,
    searchError,
    toast,
  };

  return (
    <AppContext.Provider value={contextValues}>
      <Toast ref={toast} position="bottom-center" />
      {children}
    </AppContext.Provider>
  );
}
