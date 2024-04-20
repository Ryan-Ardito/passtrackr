import { HolderData, HolderAction, passtypes, Msg } from "../types"

import { ScrollPanel } from "primereact/scrollpanel";
import { Dropdown } from "primereact/dropdown";

import { InputField, LabeledDropdown } from "./FormInput";

interface ChildProps {
  selectedHolder: HolderData,
  setSelectedHolder: React.Dispatch<HolderAction>,
}

export function PassInfo({ selectedHolder, setSelectedHolder }: ChildProps) {
  return (
    <ScrollPanel className="pass-info">
      <InputField label="First Name:" value={selectedHolder.first_name}
        onChange={(value) => setSelectedHolder({ type: Msg.SetFirstName, data: value })} />

      <InputField label="Last Name:" value={selectedHolder.last_name}
        onChange={(value) => setSelectedHolder({ type: Msg.SetLastName, data: value })} />

      <InputField label="Town:" value={selectedHolder.town}
        onChange={(value) => setSelectedHolder({ type: Msg.SetTown, data: value })} />

      <LabeledDropdown
        label="Passtype:"
        name="passtype"
        value={selectedHolder.passtype}
        options={passtypes}
        onChange={(e) => {
          setSelectedHolder({ type: Msg.SetPasstype, data: e.value, })
        }} />
    </ScrollPanel>
  )
}