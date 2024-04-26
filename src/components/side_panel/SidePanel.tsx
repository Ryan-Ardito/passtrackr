import { AddPass } from "./AddPass";
import { SidePanel } from "../../types";
import { PassControl } from "./PassInteraction";
import { AddVisits } from "./AddVisits";
import { ViewPass } from "./ViewPass";

interface PanelProps {
  panel: SidePanel;
}

export const RightPanel = ({ panel }: PanelProps) => {
  return (
    <>
      {panel === SidePanel.AddPass && <AddPass />}
      {panel === SidePanel.AddVisits && <AddVisits />}
      {panel === SidePanel.PassInteraction && <PassControl />}
      {panel === SidePanel.ViewPass && <ViewPass />}
    </>
  );
};
