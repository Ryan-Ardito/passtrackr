import { HolderData, HolderAction, passtypes, Msg } from "../types"

import { ScrollPanel } from "primereact/scrollpanel";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

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
      <div className="form-text">{label}</div>
      <InputText className="form-text-input" value={value} style={{ padding: 8 }}
        onChange={(e) => onChange(e.target.value)} />
    </>
  );
};

export function PassInfo({ selectedHolder, setSelectedHolder }: ChildProps) {
  return (
    <ScrollPanel className="holder-box">
      <InputField label="First Name:" value={selectedHolder.first_name}
        onChange={(value) => setSelectedHolder({ type: Msg.SetFirstName, data: value })} />

      <InputField label="Last Name:" value={selectedHolder.last_name}
        onChange={(value) => setSelectedHolder({ type: Msg.SetLastName, data: value })} />

      <InputField label="Town:" value={selectedHolder.town}
        onChange={(value) => setSelectedHolder({ type: Msg.SetTown, data: value })} />

      <div className="form-text">Passtype:</div>
      <Dropdown style={{ padding: 0 }} scrollHeight="400px"
        // filter resetFilterOnHide
        value={selectedHolder.passtype} options={passtypes} optionLabel="code"
        onChange={(e) => {
          setSelectedHolder({
            type: Msg.SetPasstype,
            data: e.value,
          })
        }} />
    </ScrollPanel>
  )
}