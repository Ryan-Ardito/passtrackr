import { AddVisits } from "./AddVisits";
import { useAppContext } from "../AppContext";
import { AddPassTime } from "./AddPassTime";
import { useState } from "react";

export const RenewPass = () => {
  const { selectedPass } = useAppContext();
  const [passData] = useState({ ...selectedPass });
  return (
    <>
      {["Annual", "6 Month", "Free"].includes(passData.passtype?.code || "") ? (
        <AddPassTime {...{ passData }} />
      ) : (
        <AddVisits {...{ passData }} />
      )}
    </>
  );
};
