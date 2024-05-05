import { useState } from "react";
import { BackRevert } from "./Buttons";
import { ViewPassData } from "../api/api";
import { Panel } from "primereact/panel";
import { GuestData } from "../types";

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
