import { HolderData, HolderAction, passtypes, Msg } from "../types"

import { ScrollPanel } from "primereact/scrollpanel";
import { Dropdown } from "primereact/dropdown";

import { InputField } from "./FormInput";

interface ChildProps {
  selectedHolder: HolderData,
  setSelectedHolder: React.Dispatch<HolderAction>,
}

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