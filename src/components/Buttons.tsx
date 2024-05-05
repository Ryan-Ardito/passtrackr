import { Button, ButtonProps } from "primereact/button";
import { IconType } from "primereact/utils";
import { CSSProperties, MouseEventHandler, useEffect, useState } from "react";

interface BackRevertProps {
  fieldChange?: boolean;
  prevPage: () => void;
  onRevert?: () => void;
}

export const BackRevert = ({
  fieldChange = false,
  prevPage,
  onRevert = () => undefined,
}: BackRevertProps) => {
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}
    >
      <CrudButton
        label="Back"
        icon="pi pi-arrow-left"
        onClick={(e) => {
          e.preventDefault();
          prevPage();
        }}
      />
      <CrudButton
        label="Revert"
        icon="pi pi-undo"
        severity="warning"
        disabled={!fieldChange}
        onClick={(e) => {
          e.preventDefault();
          onRevert();
        }}
      />
    </div>
  );
};

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

export const DeleteButton = ({
  label = "Button",
  icon = "",
  type = undefined,
  disabled = false,
  severity = undefined,
  size = undefined,
  style = {},
  loading = false,
  onClick = () => null,
}: DeleteButtonProps) => {
  let [confirm, setConfirm] = useState(false);

  useEffect(() => {
    setConfirm(false);
  }, [disabled]);

  return (
    <>
      <div style={{ display: "grid", width: "100%" }}>
        {confirm && !disabled ? (
          <div style={{ display: "grid", gridTemplateColumns: "50px 1fr" }}>
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
              onBlur={() => setConfirm(false)}
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
              onClick={() => setConfirm(false)}
            />
          </div>
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

export const CrudButton = ({
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
}: CrudButtonProps) => {
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
