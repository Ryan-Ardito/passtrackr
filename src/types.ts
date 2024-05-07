const ONE_YEAR_IN_DAYS: number = 365;
const SIX_MONTHS_IN_DAYS: number = 183;

export enum Screen {
  Dashboard,
  ViewGuest,
  ViewPass,
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

export const addPassTimeDropOpts = [
  { name: "1 Year", code: ONE_YEAR_IN_DAYS },
  { name: "6 Months", code: SIX_MONTHS_IN_DAYS },
];

export const numAddVisits = [
  { name: "10x Visits", code: 10 },
  { name: "6x Visits", code: 6 },
  { name: "3x Visits", code: 3 },
];

export const payMethods = [
  { name: "Credit", code: "Credit" },
  { name: "Cash", code: "Cash" },
  { name: "Check", code: "Check" },
  { name: "Comp", code: "Comp" },
];

export const passtypes: PassType[] = [
  { name: "10x Punch", code: "TenPunch" },
  { name: "6x Punch", code: "SixPunch" },
  { name: "Annual", code: "Annual" },
  { name: "6 Month", code: "SixMonth" },
  { name: "Free Pass", code: "FreePass" },
  { name: "3x Facial", code: "ThreeFacial" },
  { name: "6x Facial", code: "SixFacial" },
];

export interface VisitsRow {
  visit_id: number;
  pass_id: number;
  created_at: number;
}

export interface PaymentRow {
  payment_id: number;
  pass_id: number;
  pay_method: string | undefined;
  amount_paid: number | undefined;
  creator: string;
  created_at: number;
}

export interface SearchPassData {
  pass_id: number | undefined;
  guest_id: number | undefined;
  first_name: string;
  last_name: string;
  town: string;
  remaining_uses: number | undefined;
  passtype: PassType | undefined;
  active: boolean;
  favorite: boolean;
  creator: string;
  expires_at: number | undefined;
  created_at: number | undefined;
}

export interface GuestData {
  guest_id: number;
  first_name: string;
  last_name: string;
  email: string | undefined;
  town: string | undefined;
  notes: string | undefined;
  creator: string;
  created_at: number;
}

export const blankPass: SearchPassData = {
  pass_id: undefined,
  guest_id: undefined,
  first_name: "",
  last_name: "",
  town: "",
  remaining_uses: undefined,
  passtype: undefined,
  active: false,
  favorite: false,
  creator: "",
  expires_at: undefined,
  created_at: undefined,
};
