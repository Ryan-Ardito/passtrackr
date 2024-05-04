import { InputTextarea } from "primereact/inputtextarea";
import { CrudButton } from "./Buttons";
import { InputText } from "primereact/inputtext";
import { useAppContext } from "../AppContext";
import { Screen } from "../types";

export function EditGuestTemplate() {
  const {setScreen } = useAppContext();

  return (
    <form id="guest-info" className="flex-col">
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}
      >
        <CrudButton
          label="Back"
          icon="pi pi-arrow-left"
          onClick={(e) => {
            e.preventDefault();
            setScreen(Screen.Dashboard);
          }}
        />
        <CrudButton
          label="Revert"
          icon="pi pi-undo"
          severity="warning"
          disabled
        />
      </div>
      <InputText
        className="form-text-input p-inputtext-lg"
        placeholder="First name"
        name="first_name"
        disabled
        style={{ padding: 8 }}
      />
      <InputText
        className="form-text-input p-inputtext-lg"
        placeholder="Last name"
        name="last_name"
        disabled
        style={{ padding: 8 }}
      />
      <InputText
        className="form-text-input p-inputtext-lg"
        placeholder="Town"
        name="town"
        disabled
        style={{ padding: 8 }}
      />
      <InputText
        className="form-text-input p-inputtext-lg"
        placeholder="Email"
        name="email"
        disabled
        style={{ padding: 8 }}
      />
      <InputTextarea
        placeholder="Notes"
        name="notes"
        rows={8}
        disabled
        style={{ maxWidth: "100%", minWidth: "100%" }}
      />
      <CrudButton
        label="Save"
        icon="pi pi-save"
        type="submit"
        severity="danger"
        disabled
      />
    </form>
  );
}
