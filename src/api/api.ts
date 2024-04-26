import { invoke } from "@tauri-apps/api/tauri";

import { AddVisitsFormData, CreatePassData, PassData } from "../types";

export const searchPasses = async (
  searchString: string
): Promise<PassData[]> => {
  return invoke("search_passes", {
    search: searchString,
    delayMillis: 350,
    willFail: false,
  });
};

export const getGuest = async (guestId: number): Promise<void> => {
  return invoke("get_guest", { guestId, delayMillis: 600, willFail: false });
};

export const logVisit = async (pass: PassData): Promise<void> => {
  if (!pass.active) {
    throw { name: "Log visit", message: "Pass is inactive" };
  }
  return invoke("log_visit", { pass, delayMillis: 600, willFail: false });
};
export const addVisits = async (
  addVisitsData: AddVisitsFormData
): Promise<string> => {
  return invoke("add_visits", { addVisitsData });
};

export const createPass = async (passData: CreatePassData): Promise<string> => {
  return invoke("create_pass", { passData });
};

export const deletePass = async (passId: number | undefined): Promise<string> => {
  if (!passId) {
    throw { name: "Delete Pass", message: "Pass not found" };
  }
  return invoke("delete_pass", { passId });
};

export const asyncSleep = async (millis: number): Promise<void> => {
  return invoke("async_sleep", { millis: millis });
};
