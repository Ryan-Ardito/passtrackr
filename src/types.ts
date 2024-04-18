export enum Screen {
  Dashboard,
  ViewPass,
  Settings,
  About,
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

export interface PassType {
  name: string,
  code: string,
}

export const payMethods = [
  { name: "Credit", code: "credit" },
  { name: "Cash", code: "cash" },
]

export const passtypes: PassType[] = [
  { name: "ten_punch", code: "10x Punch" },
  { name: "six_punch", code: "6x Punch" },
  { name: "annual", code: "Annual" },
  { name: "six_month", code: "6 Month" },
  { name: "free_pass", code: "Free Pass" },
  { name: "three_facial", code: "3x Facial" },
  { name: "six_facial", code: "6x Facial" },
];

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

export type HolderAction =
  | { type: Msg.Replace; data: HolderData }
  | { type: Msg.SetFirstName; data: string }
  | { type: Msg.SetLastName; data: string }
  | { type: Msg.SetTown; data: string }
  | { type: Msg.SetPasstype; data: PassType | null }
  | { type: Msg.SetActive; data: boolean }
  | { type: Msg.SetNotes; data: string }