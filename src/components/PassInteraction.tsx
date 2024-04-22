import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

import { Panel, Screen } from "../types";
import { logVisit } from "../api/api";
import { showMessage } from "../utils/toast";
import { useAppContext } from "../AppContext";

export const PassControl = () => {
  const { selectedPass, setSelectedPass, setScreen, setPanel, toast, search } =
    useAppContext();
  const queryClient = useQueryClient();

  const { mutate: mutateLogVisit, isPending: isLogVisitPending } = useMutation({
    mutationKey: [logVisit],
    mutationFn: logVisit,
    onError: (error) => showMessage(error.name, error.message, toast, "info"),
    onSuccess: () => {
      queryClient.invalidateQueries([
        "search",
        search,
      ] as InvalidateQueryFilters);
      setSelectedPass({
        ...selectedPass,
        remaining_uses: selectedPass.remaining_uses - 1,
      });
      showMessage("Log visit", "Success!", toast, "success");
    },
  });

  return (
    <div className="flex-box flex-col flex-1" style={{ gap: "12px" }}>
      <Divider style={{ marginTop: "6px" }} />
      <Button
        label="Log Visit"
        icon="pi pi-check-square"
        severity="info"
        // size="large"
        style={{ height: "80px" }}
        disabled={!selectedPass.pass_id}
        loading={isLogVisitPending}
        onClick={() => mutateLogVisit(selectedPass)}
      />
      <Divider />
      <Button
        label="Add Visits"
        icon="pi pi-plus"
        disabled={!selectedPass.pass_id}
        onClick={() => null}
      />
      <Button
        label="View Pass"
        icon="pi pi-bars"
        disabled={!selectedPass.pass_id}
        onClick={() => setScreen(Screen.ViewPass)}
      />
      <Button
        label="View Guest"
        icon="pi pi-user"
        disabled={!selectedPass.pass_id}
        onClick={() => setScreen(Screen.ViewPass)}
      />
      <Button
        label="New Pass"
        icon="pi pi-id-card"
        onClick={() => setPanel(Panel.AddPass)}
      />
      <Divider />
      {selectedPass.pass_id && (
        <>
          <div>{selectedPass.remaining_uses} punches left</div>
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
