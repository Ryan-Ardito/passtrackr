import { Toast, ToastMessage } from "primereact/toast";

const toastLifeMap: Record<NonNullable<ToastMessage["severity"]>, number> = {
  success: 2000,
  info: 3000,
  warn: 5000,
  error: 7000,
};

export const showMessage = (
  summary: string,
  detail: string,
  ref: React.RefObject<Toast>,
  severity: ToastMessage["severity"]
) => {
  const life = toastLifeMap[severity || "info"];
  ref.current?.show({ ...{ severity, summary, detail, life } });
};
