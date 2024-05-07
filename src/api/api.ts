import { invoke } from "@tauri-apps/api/tauri";

import { GuestData, PassData, PaymentRow, VisitsRow, PassType } from "../types";

interface AddVisitsFormData {
  pass_id: number | undefined;
  num_visits: { name: string; code: number } | undefined;
  pay_method: { name: string; code: string } | undefined;
  last_four: string | undefined;
  amount_paid: string | undefined;
  signature: string;
}

interface AddTimeFormData {
  pass_id: number | undefined;
  num_days: { name: string; code: number } | undefined;
  pay_method: { name: string; code: string } | undefined;
  last_four: string | undefined;
  amount_paid: string | undefined;
  signature: string;
}

interface EditGuestFormData {
  guest_id: number;
  first_name: string;
  last_name: string;
  email: string | undefined;
  town: string | undefined;
  notes: string | undefined;
}

interface CreatePassData {
  guest_id: number | undefined;
  first_name: string;
  last_name: string;
  town: string;
  passtype: PassType | undefined;
  pay_method: { name: string; code: string } | undefined;
  last_four: string | undefined;
  amount_paid: string | undefined;
  signature: string;
}

export interface ViewPassData {
  pass_id: number;
  guest_id: number;
  first_name: string;
  last_name: string;
  town: string;
  remaining_uses: number | undefined;
  passtype: PassType;
  active: boolean;
  notes: string | undefined;
  creator: string;
  expires_at: number | undefined;
  created_at: number;
}

interface EditPassNotesData {
  notes: string | undefined;
  passId: number | undefined;
}

export const editGuest = async (
  guestData: EditGuestFormData
): Promise<number> => {
  return invoke("edit_guest", { guestData });
};

export const editPassNotes = async (data: EditPassNotesData): Promise<void> => {
  if (!data.passId) {
    throw { name: "Edit pass", message: "No pass ID" };
  }
  return invoke("edit_pass_notes", { notes: data.notes, passId: data.passId });
};

export const searchPasses = async (
  searchString: string
): Promise<PassData[]> => {
  return invoke("search_passes", {
    search: searchString,
  });
};

export const getPayments = async (
  guestId: number | undefined
): Promise<PaymentRow[]> => {
  if (!guestId) {
    throw { name: "Error", message: "No guest ID" };
  }
  return invoke("get_payments", { guestId });
};

export const getPaymentsFromPassId = async (
  passId: number | undefined
): Promise<PaymentRow[]> => {
  if (!passId) {
    throw { name: "Error", message: "No pass ID" };
  }
  return invoke("get_payments_from_pass", { passId });
};

export const getVisits = async (
  guestId: number | undefined
): Promise<VisitsRow[]> => {
  if (!guestId) {
    throw { name: "Error", message: "No guest ID" };
  }
  return invoke("get_visits", { guestId });
};

export const getVisitsFromPassId = async (
  passId: number | undefined
): Promise<VisitsRow[]> => {
  if (!passId) {
    throw { name: "Error", message: "No pass ID" };
  }
  return invoke("get_visits_from_pass", { passId });
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
  if (!addVisitsData.num_visits) {
    throw { name: "Add visit", message: "No visits selected" };
  }
  return invoke("add_visits", { addVisitsData });
};

export const addTimeToPass = async (
  addTimeData: AddTimeFormData
): Promise<number | undefined> => {
  if (!addTimeData.num_days) {
    throw { name: "Add time", message: "No time selected" };
  }
  return invoke("add_time", { addTimeData });
};

export const createPass = async (passData: CreatePassData): Promise<string> => {
  return invoke("create_pass", { passData });
};

export const setPassActive = async (passData: PassData): Promise<string> => {
  return invoke("toggle_pass_active", { passData });
};

export const setPassOwner = async (
  passId: number,
  newGuestId: number
): Promise<string> => {
  return invoke("set_pass_owner", { passId, newGuestId });
};

export const deletePass = async (passId: number | undefined): Promise<void> => {
  if (!passId) {
    throw { name: "Delete Pass", message: "Pass not found" };
  }
  return invoke("delete_pass", { passId });
};

export const asyncSleep = async (millis: number): Promise<void> => {
  return invoke("async_sleep", { millis: millis });
};
