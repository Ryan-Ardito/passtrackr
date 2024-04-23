import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { Divider } from "primereact/divider";

import { Panel, Screen } from "../types";
import { logVisit } from "../api/api";
import { showMessage } from "../utils/toast";
import { useAppContext } from "../AppContext";
import { CrudButton } from "./Buttons";

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
    <div className="h-full flex-box flex-col flex-1">
      <Divider style={{ marginTop: "6px" }} />
      <CrudButton
        label="Log Visit"
        icon="pi pi-check-square"
        severity="info"
        size="large"
        style={{ height: "80px" }}
        disabled={!selectedPass.pass_id}
        loading={isLogVisitPending}
        onClick={() => mutateLogVisit(selectedPass)}
      />
      <Divider />
      <CrudButton
        label="Add Visits"
        icon="pi pi-plus"
        disabled={!selectedPass.pass_id}
        onClick={() => null}
      />
      <CrudButton
        label="View Pass"
        icon="pi pi-bars"
        disabled={!selectedPass.pass_id}
        onClick={() => setScreen(Screen.ViewPass)}
      />
      <CrudButton
        label="View Guest"
        icon="pi pi-user"
        disabled={!selectedPass.pass_id}
        onClick={() => setScreen(Screen.ViewPass)}
      />
      <CrudButton
        label="New Pass"
        icon="pi pi-id-card"
        onClick={() => setPanel(Panel.AddPass)}
      />
      <Divider />
      {selectedPass.pass_id && (
        <>
          <div>pass_id: {selectedPass.pass_id}</div>
          <div>guest_id: {selectedPass.guest_id}</div>
          <div>first_name: {selectedPass.first_name}</div>
          <div>last_name: {selectedPass.last_name}</div>
          <div>town: {selectedPass.town}</div>
          <div>remaining_uses: {selectedPass.remaining_uses}</div>
          <div>passtype: {selectedPass.passtype.name}</div>
          <div>active: {selectedPass.active ? "yes" : "no"}</div>
          <div>creator: {selectedPass.creator}</div>
          <div>creation_time: {selectedPass.creation_time}</div>
        </>
      )}
    </div>
  );
};
