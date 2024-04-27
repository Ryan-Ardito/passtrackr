export enum Screen {
  Dashboard,
  ViewGuest,
  Settings,
  About,
}

export enum SidePanel {
  PassInteraction,
  AddPass,
  AddVisits,
  ViewPass,
}

export interface PassType {
  name: string;
  code: string;
}

export const numAddVisits = [
  { name: "10x Visits", code: 10 },
  { name: "5x Visits", code: 5 },
  { name: "3x Visits", code: 3 },
  { name: "1x Visits", code: 1 },
];

export const payMethods = [
  { name: "Credit", code: "Credit" },
  { name: "Cash", code: "Cash" },
  { name: "Check", code: "Check" },
  { name: "Comp", code: "Comp" },
];

export const passtypes: PassType[] = [
  { name: "10x Punch", code: "Punch" },
  { name: "6x Punch", code: "Punch" },
  { name: "Annual", code: "Annual" },
  { name: "6 Month", code: "6 Month" },
  { name: "Free Pass", code: "Free Pass" },
  { name: "3x Facial", code: "Facial" },
  { name: "6x Facial", code: "Facial" },
];

export interface AddVisitsFormData {
  pass_id: number | undefined;
  num_visits: { name: string; code: number };
  pay_method: { name: string; code: string };
  last_four: string | undefined;
  amount_paid: string;
  signature: string;
}

export interface CreatePassData {
  guest_id: number | undefined;
  first_name: string;
  last_name: string;
  town: string;
  passtype: PassType;
  pay_method: { name: string; code: string };
  last_four: string | undefined;
  amount_paid: string;
  signature: string;
}

export interface PassData {
  pass_id: number | undefined;
  guest_id: number | undefined;
  first_name: string;
  last_name: string;
  town: string;
  remaining_uses: number | undefined;
  passtype: PassType;
  active: boolean;
  creator: string;
  creation_time: number | undefined;
}

export interface GuestData {
  guest_id: number;
  first_name: string;
  last_name: string;
  email: string;
  town: string;
  notes: string;
  creator: string;
  creation_time: number;
}

export const blankPass: PassData = {
  pass_id: undefined,
  guest_id: undefined,
  first_name: "",
  last_name: "",
  town: "",
  remaining_uses: undefined,
  passtype: passtypes[0],
  active: false,
  creator: "",
  creation_time: undefined,
};
