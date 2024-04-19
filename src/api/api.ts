import { invoke } from "@tauri-apps/api/tauri";

import { HolderData } from "../types";

export const searchPasses = async (search_string: string): Promise<HolderData[]> => {
  return invoke("fetch_holders", { search: search_string });
}

export const logVisit = async (): Promise<void> => {
  return invoke("log_visit", {});
}

export const asyncSleep = async (millis: number): Promise<void> => {
  return invoke("async_sleep", { millis: millis });
}