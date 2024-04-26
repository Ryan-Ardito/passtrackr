import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { Divider } from "primereact/divider";

import { SidePanel } from "../../types";
import { deletePass } from "../../api/api";
import { showMessage } from "../../utils/toast";
import { useAppContext } from "../../AppContext";
import { CrudButton } from "../Buttons";
import { PassInfo } from "../PassInfo";
import { InputSwitch } from "primereact/inputswitch";

export const ViewPass = () => {
  const { selectedPass, setSelectedPass, setPanel, toast, search } =
    useAppContext();
  const queryClient = useQueryClient();

  const { mutate: mutateDeletePass, isPending: isDeletePassPending } =
    useMutation({
      mutationKey: ["deletePass"],
      mutationFn: deletePass,
      onError: (error) => showMessage(error.name, error.message, toast, "warn"),
      onSuccess: () => {
        queryClient.invalidateQueries([
          "search",
          search,
        ] as InvalidateQueryFilters);
        setSelectedPass({
          ...selectedPass,
          active: !selectedPass.active,
        });
        showMessage("Delete pass", "Success!", toast, "success");
      },
    });

  return (
    <div className="flex-box flex-col flex-1">
      <Divider style={{ marginTop: 11, marginBottom: 11 }} />
      {selectedPass.pass_id && <PassInfo selectedPass={selectedPass} />}
      <Divider style={{ marginTop: 11, marginBottom: 11 }} />
      <div className="flex-box">
        <div>Active:</div>
        <InputSwitch checked />
      </div>
      <Divider style={{ marginTop: 11, marginBottom: 11 }} />
      <CrudButton
        label="Delete Pass"
        icon="pi pi-times"
        severity="danger"
        loading={isDeletePassPending}
        onClick={(e) => {
          mutateDeletePass(selectedPass.pass_id);
          e.currentTarget.blur();
        }}
      />
      <CrudButton
        label="Back"
        icon="pi pi-arrow-left"
        onClick={() => {
          setPanel(SidePanel.PassInteraction);
        }}
      />
      {/* <Divider style={{marginTop: 11, marginBottom: 11}}/>
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
      {selectedPass.pass_id && <PassInfo selectedPass={selectedPass}/>} */}
    </div>
  );
};
