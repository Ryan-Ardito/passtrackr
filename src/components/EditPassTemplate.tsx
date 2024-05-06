import { InputTextarea } from "primereact/inputtextarea";
import { BackRevert, CrudButton } from "./Buttons";
import { Panel } from "primereact/panel";

interface EditPassTemplateProps {
  isPassLoading: boolean;
  isGuestLoading: boolean;
  prevPage: () => void;
}

export function EditPassTemplate({
  isPassLoading,
  isGuestLoading,
  prevPage,
}: EditPassTemplateProps) {
  const passPlaceHolderText = isPassLoading ? "Loading..." : "None";
  const guestPlaceHolderText = isGuestLoading ? "Loading..." : "None";
  return (
    <form id="pass-details" className="flex-col">
      <BackRevert {...{ prevPage }} />
      <InputTextarea
        placeholder="Notes"
        name="notes"
        rows={8}
        disabled
        // autoResize
        style={{ maxWidth: "100%", minWidth: "100%" }}
      />
      <CrudButton
        label="Save"
        icon="pi pi-save"
        type="submit"
        severity="danger"
        disabled
      />
      <Panel>
        <div>
          <div style={{ wordWrap: "break-word" }}>{passPlaceHolderText}</div>
          <div style={{ wordWrap: "break-word" }}>{passPlaceHolderText}</div>
        </div>
      </Panel>
      <Panel header={`Owner ${guestPlaceHolderText}`}>
        <div>{guestPlaceHolderText}</div>
        <div>{guestPlaceHolderText}</div>
      </Panel>
    </form>
  );
}
