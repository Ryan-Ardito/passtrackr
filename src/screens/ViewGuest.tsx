import { Button } from "primereact/button";

import { Screen } from "../types";
import { GuestInfo } from "../components/GuestInfo";
import { useAppContext } from "../AppContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getVisits } from "../api/api";
import { useQuery } from "@tanstack/react-query";

export function ViewGuest() {
  const { selectedPass, setScreen } = useAppContext();

  const { data: visits } = useQuery({
    queryKey: ["visits", selectedPass.pass_id],
    queryFn: () => getVisits(selectedPass.pass_id),
  });

  return (
    <div className="viewport-wrapper">
      <div id="view-guest-screen" className="center-box">
        <div id="edit-guest">
          <DataTable value={visits}>
            <Column field="visit_id" header="Visit ID" />
            <Column field="pass_id" header="Pass ID" />
            <Column field="creation_time" header="Time" />
          </DataTable>
          <GuestInfo />
          <Button
            label="Back"
            onClick={(e) => {
              e.preventDefault();
              setScreen(Screen.Dashboard);
            }}
          />
        </div>
      </div>
    </div>
  );
}
