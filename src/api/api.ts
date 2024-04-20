import { invoke } from "@tauri-apps/api/tauri";

import { PassData } from "../types";

export const searchPasses = async (search_string: string): Promise<PassData[]> => {
  return invoke("search_passes", { search: search_string, delayMillis: 350, fail: false });
}

export const logVisit = async (): Promise<void> => {
  return invoke("log_visit", {});
}

export const createPass = async (pass_data: PassData): Promise<void> => {
  return invoke("create_pass", {passData: pass_data});
}

export const asyncSleep = async (millis: number): Promise<void> => {
  return invoke("async_sleep", { millis: millis });
}