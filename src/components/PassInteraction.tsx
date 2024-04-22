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
      <Divider style={{ marginTop: "6px" }} />
      <Button
        label="Log Visit"
        icon="pi pi-check-square"
        severity="info"
        // size="large"
        style={{ height: "80px" }}
        disabled={!selectedPass.id}
        loading={isLogVisitPending}
        onClick={() => mutateLogVisit(selectedPass)}
      />
      <Divider />
      <Button
        label="Add Visits"
        icon="pi pi-plus"
        disabled={!selectedPass.id}
        onClick={() => null}
      />
      <Button
        label="View Pass"
        icon="pi pi-bars"
        disabled={!selectedPass.id}
        onClick={() => setScreen(Screen.ViewPass)}
      />
      <Button
        label="View Guest"
        icon="pi pi-user"
        disabled={!selectedPass.id}
        onClick={() => setScreen(Screen.ViewPass)}
      />
      <Button
        label="New Pass"
        icon="pi pi-id-card"
        onClick={() => setPanel(Panel.AddPass)}
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
