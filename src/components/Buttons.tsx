import { Button, ButtonProps } from "primereact/button";
import { IconType } from "primereact/utils";
import { CSSProperties, MouseEventHandler, useEffect, useState } from "react";

interface FavoriteButtonProps {
  checked: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  loading?: boolean;
  onClick?: () => void;
}

export const FavoriteButton = ({
  checked,
  disabled = false,
  style = {},
  loading = false,
  onClick = () => undefined,
}: FavoriteButtonProps) => {
  return (
    <div>
      <CrudButton
        label={checked ? "Unfavorite" : "Favorite"}
        icon={checked ? "pi pi-star-fill" : "pi pi-star"}
        disabled={disabled}
        loading={loading}
        style={style}
        severity={"warning"}
        onClick={(e) => {
          e.preventDefault();
          e.currentTarget.blur();
          onClick();
        }}
      />
    </div>
  );
};

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
      style={{
        display: "grid",
        width: "fit-content",
        gridTemplateColumns: "1fr 1fr",
        gap: "6px",
      }}
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
        severity="info"
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
      <div style={{ display: "grid", width: "fit-content" }}>
        {confirm && !disabled ? (
          <span
            style={{
              display: "grid",
              gridTemplateColumns: "50px 1fr",
            }}
          >
            <Button
              id="delete-button"
              rounded
              autoFocus
              raised={!disabled}
              icon={icon}
              type={type}
              disabled={disabled}
              severity={severity}
              size={size}
              style={{ height: "47px", width: "49px" }}
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
          </span>
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
  iconPos?: "left" | "right";
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
  iconPos = "left",
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
      iconPos={iconPos}
      disabled={disabled}
      severity={severity}
      size={size}
      style={style}
      loading={loading}
      onClick={onClick}
    />
  );
};
