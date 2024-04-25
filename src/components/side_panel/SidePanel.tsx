import { AddPass } from "./AddPass";
import { SidePanel } from "../../types";
import { PassControl } from "./PassInteraction";
import { AddVisits } from "./AddVisits";

interface PanelProps {
  panel: SidePanel;
}

export const RightPanel = ({ panel }: PanelProps) => {
  return (
    <>
      {panel === SidePanel.AddPass && <AddPass />}
      {panel === SidePanel.AddVisits && <AddVisits />}
      {panel === SidePanel.PassInteraction && <PassControl />}
    </>
  );
};
