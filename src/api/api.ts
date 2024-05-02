import { invoke } from "@tauri-apps/api/tauri";

import {
  AddVisitsFormData,
  CreatePassData,
  EditGuestFormData,
  GuestData,
  PassData,
  PaymentRow,
  ViewPassData,
  VisitsRow,
} from "../types";

export const editGuest = async (
  editGuestData: EditGuestFormData
): Promise<number> => {
  return invoke("edit_guest", { editGuestData });
};

export const searchPasses = async (
  searchString: string
): Promise<PassData[]> => {
  return invoke("search_passes", {
    search: searchString,
  });
};

export const getPayments = async (guestId: number | undefined): Promise<PaymentRow[]> => {
  if (!guestId) {
    throw { name: "Error", message: "No pass ID" };
  }
  return invoke("get_payments", { guestId });
};

export const getVisits = async (guestId: number | undefined): Promise<VisitsRow[]> => {
  if (!guestId) {
    throw { name: "Error", message: "No pass ID" };
  }
  return invoke("get_visits", { guestId });
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
  return invoke("get_pass", { passId });
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
