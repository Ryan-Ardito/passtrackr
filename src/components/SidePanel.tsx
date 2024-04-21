import { AddPass } from "./AddPass";
import { Panel } from "../types";
import { PassControl } from "./PassInteraction";

interface PanelProps {
  panel: Panel;
}

export const RightPanel = ({ panel }: PanelProps) => {
  return (
    <>
      {panel === Panel.AddPass && <AddPass />}
      {panel === Panel.PassInteraction && <PassControl />}
    </>
  );
};
