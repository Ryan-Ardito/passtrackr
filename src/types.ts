export enum Screen {
  Dashboard,
  ViewPass,
  Settings,
  About,
}

export interface PassType {
  name: string,
  code: string,
}

export interface HolderData {
  id: number | null,
  first_name: string,
  last_name: string,
  town: string,
  remaining: number,
  passtype: PassType | null,
  active: boolean,
  notes: string,
}

export const blankHolder: HolderData = {
  id: null,
  first_name: "",
  last_name: "",
  town: "",
  remaining: 0,
  passtype: null,
  active: false,
  notes: "",
}

export enum Msg {
  Replace = "REPLACE",
  SetFirstName = "SET_FIRST_NAME",
  SetLastName = "SET_LAST_NAME",
  SetTown = "SET_TOWN",
  SetPasstype = "SET_PASSTYPE",
  SetActive = "SET_ACTIVE",
  SetNotes = "SET_NOTES",
}

export type HolderAction =
  | { type: Msg.Replace; data: HolderData }
  | { type: Msg.SetFirstName; data: string }
  | { type: Msg.SetLastName; data: string }
  | { type: Msg.SetTown; data: string }
  | { type: Msg.SetPasstype; data: PassType | null }
  | { type: Msg.SetActive; data: boolean }
  | { type: Msg.SetNotes; data: string }