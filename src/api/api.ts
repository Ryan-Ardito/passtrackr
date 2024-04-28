import { invoke } from "@tauri-apps/api/tauri";

import {
  AddVisitsFormData,
  CreatePassData,
  GuestData,
  PassData,
  ViewPassData,
} from "../types";

export const searchPasses = async (
  searchString: string
): Promise<PassData[]> => {
  return invoke("search_passes", {
    search: searchString,
  });
};

export const getGuest = async (
  guestId: number | undefined
): Promise<GuestData> => {
  if (!guestId) {
    throw { name: "View guest", message: "No guest ID" };
  }
  return invoke("get_guest", { guestId });
};

export const getPass = async (
  passId: number | undefined
): Promise<ViewPassData> => {
  if (!passId) {
    throw { name: "View pass", message: "No pass ID" };
  }
  return invoke("get_pass", { guestId: passId });
};

export const logVisit = async (pass: PassData): Promise<void> => {
  if (!pass.active) {
    throw { name: "Log visit", message: "Pass is inactive" };
  }
  return invoke("log_visit", { pass });
};

export const addVisits = async (
  addVisitsData: AddVisitsFormData
): Promise<string> => {
  return invoke("add_visits", { addVisitsData });
};

export const createPass = async (passData: CreatePassData): Promise<string> => {
  return invoke("create_pass", { passData });
};

export const setPassActive = async (passData: PassData): Promise<string> => {
  return invoke("toggle_pass_active", { passData });
};

export const deletePass = async (
  passId: number | undefined
): Promise<string> => {
  if (!passId) {
    throw { name: "Delete Pass", message: "Pass not found" };
  }
  return invoke("delete_pass", { passId });
};

export const asyncSleep = async (millis: number): Promise<void> => {
  return invoke("async_sleep", { millis: millis });
};
