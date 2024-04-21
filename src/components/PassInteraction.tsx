import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

import { PassData, Screen } from "../types";
import { logVisit } from "../api/api";
import { RefObject } from "react";
import { useMutation } from "@tanstack/react-query";
import { Toast } from "primereact/toast";
import { showMessage } from "../utils/toast";

interface ChildProps {
  selectedPass: PassData;
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  setAddPass: React.Dispatch<React.SetStateAction<boolean>>;
  toast: RefObject<Toast>;
}

export const PassInteraction = ({
  selectedPass,
  setScreen,
  setAddPass,
  toast,
}: ChildProps) => {
  const { mutate: mutateLogVisit, isPending: isLogVisitPending } = useMutation({
    mutationKey: [logVisit],
    mutationFn: logVisit,
    onError: (error) => showMessage(error.name, error.message, toast, "warn"),
    onSuccess: () => showMessage("Log visit", "Success!", toast, "success"),
  });

  return (
    <div className="pass-interaction">
      <Button
        label="View Pass"
        disabled={!selectedPass.id}
        onClick={() => setScreen(Screen.ViewPass)}
      />
      <Button
        label="Add Visits"
        disabled={!selectedPass.id}
        onClick={(e) => e.preventDefault()}
      />
      <Button label="New Pass" onClick={() => setAddPass(true)} />
      <Divider />
      <Button
        disabled={!selectedPass.id}
        label="Log Visit"
        loading={isLogVisitPending}
        onClick={() => mutateLogVisit(selectedPass)}
      />
      <Divider />
      {selectedPass.id && (
        <>
          <div>{selectedPass.remaining} punches left</div>
          <div>
            Guest: {selectedPass.first_name} {selectedPass.last_name}
          </div>
          <div>Town: {selectedPass.town}</div>
          <div>Guest ID: {selectedPass.guest_id}</div>
        </>
      )}
    </div>
  );
};
