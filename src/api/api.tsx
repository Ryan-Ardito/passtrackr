import { invoke } from "@tauri-apps/api/tauri";

import { HolderData } from "../App";

export const fetchHolders = async (search_string: string): Promise<HolderData[]> => {
  return invoke("fetch_holders", { search: search_string });
}