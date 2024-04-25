import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { Divider } from "primereact/divider";

import { SidePanel, Screen } from "../../types";
import { logVisit } from "../../api/api";
import { showMessage } from "../../utils/toast";
import { useAppContext } from "../../AppContext";
import { CrudButton } from "../Buttons";
import { PassInfo } from "../PassInfo";

export const PassControl = () => {
  const { selectedPass, setSelectedPass, setScreen, setPanel, toast, search } =
    useAppContext();
  const queryClient = useQueryClient();

  const { mutate: mutateLogVisit, isPending: isLogVisitPending } = useMutation({
    mutationKey: ["logVisit"],
    mutationFn: logVisit,
    onError: (error) => showMessage(error.name, error.message, toast, "warn"),
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
    <div className="flex-box flex-col flex-1">
      {/* <Divider style={{ marginTop: "6px" }} /> */}
      <Divider style={{marginTop: 11, marginBottom: 11}}/>
      <CrudButton
        label="Log Visit"
        icon="pi pi-check-square"
        severity="info"
        size="large"
        style={{ height: "80px" }}
        disabled={
          !selectedPass.pass_id ||
          !selectedPass.active ||
          selectedPass.remaining_uses === 0
        }
        loading={isLogVisitPending}
        onClick={() => mutateLogVisit(selectedPass)}
      />
      <Divider style={{marginTop: 11, marginBottom: 11}}/>
      <CrudButton
        label="Add Visits"
        icon="pi pi-plus"
        disabled={!selectedPass.pass_id}
        onClick={() => setPanel(SidePanel.AddVisits)}
      />
      <CrudButton
        label="View Pass"
        icon="pi pi-bars"
        disabled={!selectedPass.pass_id}
        onClick={() => setScreen(Screen.ViewGuest)}
      />
      <CrudButton
        label="View Guest"
        icon="pi pi-user"
        disabled={!selectedPass.pass_id}
        onClick={() => setScreen(Screen.ViewGuest)}
      />
      <CrudButton
        label="New Pass"
        icon="pi pi-id-card"
        onClick={() => setPanel(SidePanel.AddPass)}
      />
      <Divider style={{marginTop: 6, marginBottom: 6}}/>
      {selectedPass.pass_id && <PassInfo selectedPass={selectedPass}/>}
    </div>
  );
};
