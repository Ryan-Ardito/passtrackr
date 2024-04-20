import { invoke } from "@tauri-apps/api/tauri";

import { PassData } from "../types";

export const searchPasses = async (
  search_string: string
): Promise<PassData[]> => {
  return invoke("search_passes", {
    search: search_string,
    delayMillis: 350,
    willFail: false,
  });
};

export const logVisit = async (passId: number | undefined): Promise<void> => {
  return invoke("log_visit", { passId: passId, delayMillis: 600, willFail: false });
};

export const createPass = async (pass_data: string): Promise<void> => {
  return invoke("create_pass", {
    passData: pass_data,
    delayMillis: 350,
    willFail: true,
  });
};

export const asyncSleep = async (millis: number): Promise<void> => {
  return invoke("async_sleep", { millis: millis });
};
