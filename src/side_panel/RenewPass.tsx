import { AddVisits } from "./AddVisits";
import { useAppContext } from "../AppContext";
import { AddPassTime } from "./AddPassTime";

export const RenewPass = () => {
  const { selectedPass } = useAppContext();
  return (
    <>
      {["Annual", "6 Month", "Free"].includes(
        selectedPass.passtype.code
      ) ? (
        <AddPassTime />
      ) : (
        <AddVisits />
      )}
    </>
  );
};
