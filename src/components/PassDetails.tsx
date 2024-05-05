import { useState } from "react";
import { CrudButton } from "./Buttons";
import { ViewPassData } from "../api/api";

interface PassDetailsProps {
  passData: ViewPassData | undefined;
  prevPage: () => void;
}

export function PassDetails({ passData, prevPage }: PassDetailsProps) {
  let [fieldChange, setFieldChange] = useState(false);

  let createdAt = undefined;
  if (passData?.created_at) {
    createdAt = new Date(passData.created_at).toLocaleDateString();
  }

  return (
    <form id="pass-details" className="flex-col">
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}
      >
        <CrudButton
          label="Back"
          icon="pi pi-arrow-left"
          onClick={(e) => {
            e.preventDefault();
            prevPage();
          }}
        />
        <CrudButton
          label="Revert"
          icon="pi pi-undo"
          severity="warning"
          disabled={!fieldChange}
          onClick={(e) => {
            e.preventDefault();
            // formik.resetForm();
            setFieldChange(false);
          }}
        />
        <div></div>
        <div style={{ wordWrap: "break-word" }}>
          Created {createdAt} by {passData?.creator}
        </div>
      </div>
    </form>
  );
}
