import { AddPass } from "./AddPass";
import { SidePanel } from "../../types";
import { PassControl } from "./PassInteraction";
import { AddVisits } from "./AddVisits";
import { ViewPass } from "./ViewPass";
import { ScrollPanel } from "primereact/scrollpanel";

interface PanelProps {
  panel: SidePanel;
}

export const RightPanel = ({ panel }: PanelProps) => {
  let flex = 1;
  if (panel === SidePanel.AddPass) {
    flex = 2;
  }
  return (
    <ScrollPanel id="right-panel" style={{ flex }}>
      {panel === SidePanel.AddPass && <AddPass />}
      {panel === SidePanel.AddVisits && <AddVisits />}
      {panel === SidePanel.PassInteraction && <PassControl />}
      {panel === SidePanel.ViewPass && <ViewPass />}
    </ScrollPanel>
  );
};
