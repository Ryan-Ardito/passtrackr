import { useState } from "react";
import { BackRevert } from "./Buttons";
import { ViewPassData } from "../api/api";
import { PassInfo } from "./PassInfo";
import { useAppContext } from "../AppContext";

interface PassDetailsProps {
  passData: ViewPassData | undefined;
  prevPage: () => void;
}

export function PassDetails({ passData, prevPage }: PassDetailsProps) {
  let { selectedPass } = useAppContext();
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
      {passData?.expires_at && <div>{`Expires ${passData?.expires_at}`}</div>}
      <PassInfo {...{ selectedPass }} />
    </form>
  );
}
