import { Panel } from "primereact/panel";
import { MONTH_IN_SECONDS, SearchPassData } from "../types";
import { Divider } from "primereact/divider";

interface RemainingUsesTextProps {
  remaining_uses: number;
}

export const RemainingUsesText = ({
  remaining_uses,
}: RemainingUsesTextProps) => {
  const color =
    remaining_uses === 0
      ? "red"
      : remaining_uses < 2
      ? "darkgoldenrod"
      : "green";
  const useUses = remaining_uses === 1 ? "use" : "uses";
  return (
    <b style={{ color }}>
      {remaining_uses} {useUses} remaining
    </b>
  );
};

interface ExpirationTextProps {
  expires_at: number;
}

export const ExpirationText = ({ expires_at }: ExpirationTextProps) => {
  const expiresAt = new Date(expires_at).toLocaleDateString();
  const color =
    Date.now() + MONTH_IN_SECONDS * 1000 > expires_at
      ? "darkgoldenrod"
      : "green";
  return (
    <>
      {Date.now() > expires_at ? (
        <>
          <b style={{ color: "red" }}>Expired {expiresAt}</b>
        </>
      ) : (
        <b style={{ color }}>Expires {expiresAt}</b>
      )}
    </>
  );
};

export const FreePassText = () => {
  return <b style={{ color: "green" }}>Free forever!</b>;
};

interface PassInfoProps {
  selectedPass: SearchPassData;
  // isLoading: boolean;
  // error: Error | null;
}

export const PassInfo = ({ selectedPass }: PassInfoProps) => {
  let createdAt = undefined;
  if (selectedPass?.created_at) {
    createdAt = new Date(selectedPass.created_at).toLocaleDateString();
  }

  return (
    <Panel
      header={`${selectedPass.passtype?.name} Pass ${selectedPass.pass_id}`}
    >
      <div>
        {selectedPass.passtype?.code == "Free" && <FreePassText />}
        {selectedPass.remaining_uses != undefined && (
          <RemainingUsesText remaining_uses={selectedPass.remaining_uses} />
        )}
        {selectedPass.expires_at && (
          <ExpirationText expires_at={selectedPass.expires_at} />
        )}
      </div>
      <Divider style={{ margin: "12px" }} />
      <div>
        {selectedPass.first_name} {selectedPass.last_name}{" "}
        {selectedPass.guest_id}
      </div>
      <div style={{ wordWrap: "break-word" }}>
        Created {createdAt} by {selectedPass.creator}
      </div>
    </Panel>
  );
};
