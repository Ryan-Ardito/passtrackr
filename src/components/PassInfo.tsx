import { PassData, PassAction, passtypes, Msg } from "../types"

import { ScrollPanel } from "primereact/scrollpanel";

import { InputField, LabeledDropdown } from "./FormInput";

interface ChildProps {
  selectedPass: PassData,
  setSelectedPass: React.Dispatch<PassAction>,
}

export function PassInfo({ selectedPass, setSelectedPass }: ChildProps) {
  return (
    <ScrollPanel className="pass-info">
      <InputField label="First Name:" value={selectedPass.first_name}
        onChange={(value) => setSelectedPass({ type: Msg.SetFirstName, data: value })} />

      <InputField label="Last Name:" value={selectedPass.last_name}
        onChange={(value) => setSelectedPass({ type: Msg.SetLastName, data: value })} />

      <InputField label="Town:" value={selectedPass.town}
        onChange={(value) => setSelectedPass({ type: Msg.SetTown, data: value })} />

      <LabeledDropdown
        label="Passtype:"
        name="passtype"
        value={selectedPass.passtype}
        options={passtypes}
        onChange={(e) => {
          setSelectedPass({ type: Msg.SetPasstype, data: e.value, })
        }} />
    </ScrollPanel>
  )
}