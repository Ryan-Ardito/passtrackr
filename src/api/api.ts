import { invoke } from "@tauri-apps/api/tauri";

import {
  AddVisitsFormData,
  CreatePassData,
  GuestData,
  PassData,
  PaymentRow,
  ViewPassData,
  VisistRow,
} from "../types";

export const searchPasses = async (
  searchString: string
): Promise<PassData[]> => {
  return invoke("search_passes", {
    search: searchString,
  });
};

export const getPayments = async (passId: number): Promise<PaymentRow[]> => {
  return invoke("get_payments_from_pass_id", { passId });
};

export const getVisits = async (passId: number): Promise<VisistRow[]> => {
  return invoke("get_visits_from_pass_id", { passId });
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

export const logVisit = async (pass: PassData): Promise<number> => {
  if (!pass.active) {
    throw { name: "Log visit", message: "Pass is inactive" };
  }
  return invoke("log_visit", { pass });
};

export const addVisits = async (
  addVisitsData: AddVisitsFormData
): Promise<number> => {
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
): Promise<number> => {
  if (!passId) {
    throw { name: "Delete Pass", message: "Pass not found" };
  }
  return invoke("delete_pass", { passId });
};

export const asyncSleep = async (millis: number): Promise<void> => {
  return invoke("async_sleep", { millis: millis });
};
