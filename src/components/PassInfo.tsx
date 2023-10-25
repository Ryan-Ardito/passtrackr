import { HolderData } from "../App"
import { PassType } from "../App"

import { ScrollPanel } from "primereact/scrollpanel";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

const passtypes: PassType[] = [
  { name: "ten_punch", code: "10x Punch" },
  { name: "six_punch", code: "6x Punch" },
  { name: "annual", code: "Annual" },
  { name: "six_month", code: "6 Month" },
  { name: "free_pass", code: "Free Pass" },
  { name: "three_facial", code: "3x Facial" },
  { name: "six_facial", code: "6x Facial" },
];

type HolderAction =
  | { type: "replace"; data: HolderData }
  | { type: "set_first_name"; data: string }
  | { type: "set_last_name"; data: string }
  | { type: "set_town"; data: string }
  | { type: "set_passtype"; data: PassType | null }
  | { type: "set_active"; data: boolean }
  | { type: "set_notes"; data: string }

interface ChildProps {
  selectedHolder: HolderData,
  setSelectedHolder: React.Dispatch<HolderAction>,
}

export function PassInfo({ selectedHolder, setSelectedHolder }: ChildProps) {
  return (
    <ScrollPanel className="holder-box">
      <div>First Name:</div>
      <InputText className="form-text-input" value={selectedHolder.first_name} style={{ padding: 8 }}
        onChange={(e) => setSelectedHolder({
          type: 'set_first_name',
          data: e.target.value,
        })} />

      <div> Last Name:</div>
      <InputText className="form-text-input" value={selectedHolder.last_name} style={{ padding: 8 }}
        onChange={(e) => setSelectedHolder({
          type: 'set_last_name',
          data: e.target.value,
        })} />

      <div> Town:</div>
      <InputText className="form-text-input" value={selectedHolder.town} style={{ padding: 8 }}
        onChange={(e) => setSelectedHolder({
          type: 'set_town',
          data: e.target.value,
        })} />

      <div>Passtype:</div>
      <Dropdown style={{ padding: 0 }} scrollHeight="400px"
        // filter resetFilterOnHide
        value={selectedHolder.passtype} options={passtypes} optionLabel="code"
        onChange={(e) => {
          setSelectedHolder({
            type: 'set_passtype',
            data: e.value,
          })
        }} />
    </ScrollPanel>
  )
}