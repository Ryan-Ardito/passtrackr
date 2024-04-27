import { Button, ButtonProps } from "primereact/button";
import { IconType } from "primereact/utils";
import { CSSProperties, MouseEventHandler, useState } from "react";

interface DeleteButtonProps {
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

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  label = "Button",
  icon = "",
  type = undefined,
  disabled = false,
  severity = undefined,
  size = undefined,
  style = {},
  loading = false,
  onClick = () => null,
}) => {
  let [confirm, setConfirm] = useState(false);

  return (
    <>
        <div style={{display: "flex", marginTop: "auto", width: "100%"}}>
      {confirm ? (
        <>
          <Button
            id="delete-button"
            rounded
            raised={!disabled}
            icon={icon}
            type={type}
            disabled={disabled}
            severity={severity}
            size={size}
            loading={loading}
            onClick={(e) => {
              onClick(e);
              setConfirm(false);
            }}
          />
          <Button
            label="Are you Sure?"
            rounded
            raised={!disabled}
            type={type}
            disabled={disabled}
            size={size}
            style={style}
            loading={loading}
            onClick={() => {
              setConfirm(false);
            }}
          />
        </>
      ) : (
        <Button
          id="delete-button"
          rounded
          raised={!disabled}
          label={label}
          icon={icon}
          type={type}
          disabled={disabled}
          severity={severity}
          size={size}
          style={style}
          onClick={(e) => {
            e.preventDefault();
            setConfirm(true);
          }}
        />
      )}
        </div>
    </>
  );
};

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
