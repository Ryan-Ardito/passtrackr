import { AddPass } from "./AddPass";
import { SidePanel } from "../types";
import { PassControl } from "./PassInteraction";
import { ViewPass } from "./ViewPass";
import { ScrollPanel } from "primereact/scrollpanel";
import { RenewPass } from "./RenewPass";

interface PanelProps {
  panel: SidePanel;
}

export const RightPanel = ({ panel }: PanelProps) => {
  let flex = 1;
  if (panel === SidePanel.AddPass || panel === SidePanel.AddVisits) {
    flex = 2;
  }
  return (
    <ScrollPanel id="right-panel" style={{ flex }}>
      {panel === SidePanel.AddPass && <AddPass />}
      {panel === SidePanel.AddVisits && <RenewPass />}
      {panel === SidePanel.PassInteraction && <PassControl />}
      {panel === SidePanel.ViewPass && <ViewPass />}
    </ScrollPanel>
  );
};
