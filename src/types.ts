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
  { name: "1x Visits", code: 1 },
  { name: "3x Visits", code: 3 },
  { name: "5x Visits", code: 5 },
  { name: "10x Visits", code: 10 },
];

export const payMethods = [
  { name: "Credit", code: "credit" },
  { name: "Cash", code: "cash" },
  { name: "Check", code: "check" },
  { name: "Complimentary", code: "comp" },
];

export const passtypes: PassType[] = [
  { name: "10x Punch", code: "punch" },
  { name: "6x Punch", code: "punch" },
  { name: "Annual", code: "annual" },
  { name: "6 Month", code: "six_month" },
  { name: "Free Pass", code: "free_pass" },
  { name: "3x Facial", code: "facial" },
  { name: "6x Facial", code: "facial" },
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
  remaining_uses: number;
  passtype: PassType;
  active: boolean;
  creator: string;
  creation_time: number;
}

export const blankPass: PassData = {
  pass_id: undefined,
  guest_id: undefined,
  first_name: "",
  last_name: "",
  town: "",
  remaining_uses: 0,
  passtype: passtypes[0],
  active: false,
  creator: "",
  creation_time: 10,
};
