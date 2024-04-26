import { Button, ButtonProps } from "primereact/button";
import { IconType } from "primereact/utils";
import { CSSProperties, MouseEventHandler } from "react";

interface CrudButtonProps {
  label?: string | undefined;
  icon?: IconType<ButtonProps>;
  type?: "submit" | "reset" | "button" | undefined;
  disabled?: boolean;
  severity?:
    | "info"
    | "success"
    | "secondary"
    | "warning"
    | "danger"
    | "help"
    | undefined;
  size?: "large" | "small" | undefined;
  style?: CSSProperties;
  loading?: boolean | undefined;
  badge?: string | undefined;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const CrudButton: React.FC<CrudButtonProps> = ({
  label = "Button",
  icon = "",
  type = undefined,
  disabled = false,
  severity = undefined,
  size = undefined,
  style = {},
  loading = false,
  badge = undefined,
  onClick = () => null,
}) => {
  return (
    <Button
      id="crud-button"
      rounded
      badge={badge}
      raised={!disabled}
      label={label}
      icon={icon}
      type={type}
      disabled={disabled}
      severity={severity}
      size={size}
      style={style}
      loading={loading}
      onClick={onClick}
    />
  );
};
