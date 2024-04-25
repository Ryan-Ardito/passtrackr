import { passtypes } from "../types";

import { ScrollPanel } from "primereact/scrollpanel";

import { InputField, LabeledDropdown } from "./FormInput";
import { useAppContext } from "../AppContext";

export function GuestInfo() {
  const { selectedPass, setSelectedPass } = useAppContext();

  return (
    <ScrollPanel className="pass-info">
      <InputField
        label="First Name:"
        value={selectedPass.first_name}
        onChange={(value) =>
          setSelectedPass({ ...selectedPass, first_name: value })
        }
      />

      <InputField
        label="Last Name:"
        value={selectedPass.last_name}
        onChange={(value) =>
          setSelectedPass({ ...selectedPass, last_name: value })
        }
      />

      <InputField
        label="Town:"
        value={selectedPass.town}
        onChange={(value) => setSelectedPass({ ...selectedPass, town: value })}
      />

      <LabeledDropdown
        label="Passtype:"
        name="passtype"
        value={selectedPass.passtype}
        options={passtypes}
        onChange={(e) => {
          setSelectedPass({...selectedPass, passtype: e.value });
        }}
      />
    </ScrollPanel>
  );
}
