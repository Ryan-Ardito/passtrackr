import { InputTextarea } from "primereact/inputtextarea";
import { BackRevert, CrudButton } from "./Buttons";
import { InputText } from "primereact/inputtext";

export function EditGuestTemplate({ prevPage }: { prevPage: () => void }) {
  return (
    <form id="guest-info" className="flex-col">
      <BackRevert {...{ prevPage }} />
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
        value=""
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
