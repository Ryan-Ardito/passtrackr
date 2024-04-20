import { Toast, ToastMessage } from "primereact/toast";

const toastLifeMap: Record<NonNullable<ToastMessage["severity"]>, number> = {
  success: 1500,
  info: 5000,
  warn: 6500,
  error: 8000,
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
