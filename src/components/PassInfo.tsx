import { HolderData, HolderAction, PassType } from "../App"

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

interface ChildProps {
  selectedHolder: HolderData,
  setSelectedHolder: React.Dispatch<HolderAction>,
}

interface InputFieldProps {
  label: string,
  value: string,
  onChange: (value: string) => void,
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange }) => {
  return (
    <>
      <div>{label}</div>
      <InputText className="form-text-input" value={value} style={{ padding: 8 }}
        onChange={(e) => onChange(e.target.value)} />
    </>
  );
};

export function PassInfo({ selectedHolder, setSelectedHolder }: ChildProps) {
  return (
    <ScrollPanel className="holder-box">
      <InputField label="First Name:" value={selectedHolder.first_name}
        onChange={(value) => setSelectedHolder({ type: "set_first_name", data: value })} />

      <InputField label="Last Name:" value={selectedHolder.last_name}
        onChange={(value) => setSelectedHolder({ type: "set_last_name", data: value })} />

      <InputField label="Town:" value={selectedHolder.town}
        onChange={(value) => setSelectedHolder({ type: "set_town", data: value })} />

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