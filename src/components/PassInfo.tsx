import { Panel } from "primereact/panel";
import { PassData } from "../types";
import { Divider } from "primereact/divider";

const MONTH_IN_SECONDS = 2629800;

interface PassInfoProps {
  selectedPass: PassData;
  // isLoading: boolean;
  // error: Error | null;
}

export const PassInfo = ({ selectedPass }: PassInfoProps) => {
  let createdAt = undefined;
  if (selectedPass?.created_at) {
    createdAt = new Date(selectedPass.created_at).toLocaleDateString();
  }
  let expiresAt = undefined;
  if (selectedPass?.expires_at) {
    expiresAt = new Date(selectedPass.expires_at).toLocaleDateString();
  }

  return (
    <Panel
      header={`${selectedPass.passtype?.name} Pass ${selectedPass.pass_id}`}
    >
      <div>
        {selectedPass.remaining_uses != undefined &&
          (selectedPass.remaining_uses === 0 ? (
            <b
              style={{ color: "red" }}
            >{`${selectedPass.remaining_uses} uses remaining`}</b>
          ) : (
            <b
              style={{ color: "green" }}
            >{`${selectedPass.remaining_uses} uses remaining`}</b>
          ))}
        {selectedPass.expires_at &&
          (Date.now() > selectedPass.expires_at ? (
            <>
              <b style={{ color: "red" }}>Expired {expiresAt}</b>
            </>
          ) : (Date.now() + MONTH_IN_SECONDS) * 1000 >
            selectedPass.expires_at ? (
            <>
              <b style={{ color: "darkgoldenrod" }}>Expires {expiresAt}</b>
            </>
          ) : (
            <b style={{ color: "green" }}>{`Expires ${expiresAt}`}</b>
          ))}
      </div>
      <Divider style={{ margin: "12px" }} />
      <div>Owner ID: {selectedPass.guest_id}</div>
      <div style={{ wordWrap: "break-word" }}>
        Created {createdAt} by {selectedPass.creator}
      </div>
    </Panel>
  );
};
