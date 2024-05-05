import { Panel } from "primereact/panel";
import { PassData } from "../types";

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
          `${selectedPass.remaining_uses} uses remaining`}
        {selectedPass.expires_at &&
          (Date.now() > selectedPass.expires_at ? (
            <>
              <b style={{ color: "red" }}>Expired</b> {expiresAt}
            </>
          ) : (
            `Expires ${expiresAt}`
          ))}
      </div>
      <div>Owner ID: {selectedPass.guest_id}</div>
      <div style={{ wordWrap: "break-word" }}>
        Created {createdAt} by {selectedPass.creator}
      </div>
    </Panel>
  );
};
