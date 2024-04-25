import { AddPass } from "./AddPass";
import { SidePanel } from "../../types";
import { PassControl } from "./PassInteraction";

interface PanelProps {
  panel: SidePanel;
}

export const RightPanel = ({ panel }: PanelProps) => {
  return (
    <>
      {panel === SidePanel.AddPass && <AddPass />}
      {panel === SidePanel.PassInteraction && <PassControl />}
    </>
  );
};
