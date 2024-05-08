import { InputTextarea } from "primereact/inputtextarea";
import { BackRevert, CrudButton } from "./Buttons";

interface EditPassTemplateProps {
  prevPage: () => void;
}

export function EditPassTemplate({ prevPage }: EditPassTemplateProps) {
  return (
    <form id="pass-details" className="flex-col">
      <BackRevert {...{ prevPage }} />
      <InputTextarea
        placeholder="Notes"
        name="notes"
        value=""
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
