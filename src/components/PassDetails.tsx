import { useState } from "react";
import { BackRevert, CrudButton } from "./Buttons";
import { ViewPassData } from "../api/api";
import { Panel } from "primereact/panel";
import { GuestData } from "../types";
import { InputTextarea } from "primereact/inputtextarea";

interface PassDetailsProps {
  passData: ViewPassData | undefined;
  guestData: GuestData | undefined;
  prevPage: () => void;
}

export function PassDetails({
  passData,
  guestData,
  prevPage,
}: PassDetailsProps) {
  let [fieldChange, setFieldChange] = useState(false);

  let createdAt = undefined;
  if (passData?.created_at) {
    createdAt = new Date(passData.created_at).toLocaleDateString();
  }

  return (
    <form id="pass-details" className="flex-col">
      <BackRevert
        {...{ fieldChange, prevPage }}
        onRevert={() => {
          // formik.resetForm();
          setFieldChange(false);
        }}
      />
      <InputTextarea
        placeholder="Notes"
        name="notes"
        // value={formik.values.notes}
        rows={8}
        // autoResize
        style={{ maxWidth: "100%", minWidth: "100%" }}
        // onChange={(e) => {
        //   setFieldChange(true);
        //   formik.handleChange(e);
        // }}
      />
      <CrudButton
        label="Save"
        icon="pi pi-save"
        type="submit"
        severity="danger"
        // loading={isEditGuestPending}
        disabled={!fieldChange}
      />
      <Panel>
        {passData?.expires_at && (
          <div>{`Expires ${new Date(
            passData?.expires_at
          ).toLocaleDateString()}`}</div>
        )}
        <div style={{ wordWrap: "break-word" }}>
          Created {createdAt} by {passData?.creator}
        </div>
      </Panel>
      <Panel header={`Owner ${guestData?.guest_id}`}>
        <div>{`${guestData?.first_name} ${guestData?.last_name}`}</div>
        {<div>{`Town: ${guestData?.town}`}</div>}
      </Panel>
    </form>
  );
}
