import { useMutation } from "@tanstack/react-query";

import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

import { Panel, Screen } from "../types";
import { logVisit } from "../api/api";
import { showMessage } from "../utils/toast";
import { useAppContext } from "../AppContext";

export const PassControl = () => {
  const { selectedPass, setScreen, setPanel, toast } = useAppContext();

  const { mutate: mutateLogVisit, isPending: isLogVisitPending } = useMutation({
    mutationKey: [logVisit],
    mutationFn: logVisit,
    onError: (error) => showMessage(error.name, error.message, toast, "info"),
    onSuccess: () => showMessage("Log visit", "Success!", toast, "success"),
  });

  return (
    <div className="flex-box flex-col flex-1">
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
      <Button label="New Pass" onClick={() => setPanel(Panel.AddPass)} />
      <Divider />
      <Button
        icon="pi pi-check"
        badge={`${selectedPass.remaining}`}
        severity="info"
        style={{height: "80px"}}
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
