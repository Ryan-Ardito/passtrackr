import { invoke } from "@tauri-apps/api/tauri";

import { NewPassData, PassData } from "../types";

export const searchPasses = async (
  searchString: string
): Promise<PassData[]> => {
  return invoke("search_passes", {
    search: searchString,
    delayMillis: 350,
    willFail: false,
  });
};

export const logVisit = async (passId: number | undefined): Promise<void> => {
  return invoke("log_visit", { passId, delayMillis: 600, willFail: false });
};

export const createPass = async (passData: NewPassData): Promise<string> => {
  return invoke("create_pass", {
    passData,
    delayMillis: 350,
    willFail: false,
  });
};

export const asyncSleep = async (millis: number): Promise<void> => {
  return invoke("async_sleep", { millis: millis });
};
