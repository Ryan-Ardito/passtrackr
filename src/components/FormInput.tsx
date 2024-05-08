import { FormikContextType } from "formik";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { ChangeEventHandler, KeyboardEventHandler, useState } from "react";
import { CrudButton } from "./Buttons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setPassOwner } from "../api/api";
import { useAppContext } from "../AppContext";
import { showMessage } from "../utils/toast";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const InputField = ({ label, value, onChange }: InputFieldProps) => {
  return (
    <>
      <div className="form-input-label">{label}</div>
      <InputText
        className="form-text-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  );
};

interface MessageRequiredProps {
  label: string;
  touched: any;
  error: string | undefined;
}

export const MessageRequired = ({ touched, error }: MessageRequiredProps) => {
  return (
    <>
      {touched && error && (
        <Message text={error} style={{ height: "38px" }} severity="warn" />
      )}
    </>
  );
};

interface FormikFieldProps {
  label: string;
  name: string;
  formik: FormikContextType<any>;
  onChange?: ChangeEventHandler<HTMLElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
}

export const FormikField = ({
  label,
  name,
  formik,
  onChange = formik.handleChange,
  onKeyDown,
}: FormikFieldProps) => {
  const { values, touched, errors, isSubmitting } = formik;

  return (
    <>
      {/* <div className="form-input-label">{label}</div> */}
      <div style={{ display: "flex", gap: "6px" }}>
        <InputText
          placeholder={label}
          style={{ padding: 8 }}
          className="form-text-input p-inputtext-lg"
          name={name}
          disabled={isSubmitting}
          value={values[name]}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        <MessageRequired
          label={label}
          error={errors[name]?.toString()}
          touched={touched[name]?.valueOf()}
        />
      </div>
    </>
  );
};

interface FormikDropdownProps {
  label: string;
  name: string;
  placeholder?: string;
  options: any[];
  formik: FormikContextType<any>;
}

export const FormikDropdown = ({
  label,
  name,
  placeholder,
  options,
  formik,
}: FormikDropdownProps) => {
  const { values, touched, errors, isSubmitting, handleChange } = formik;

  return (
    <>
      {/* <div className="form-input-label">{label}</div> */}
      <div style={{ display: "flex", gap: "6px" }}>
        <Dropdown
          optionLabel="name"
          placeholder={placeholder}
          scrollHeight="400px"
          {...{ options, name }}
          disabled={isSubmitting}
          value={values[name]}
          onChange={handleChange}
        />
        <MessageRequired
          label={label}
          error={errors[name] && "Required"}
          touched={touched[name]?.valueOf()}
        />
      </div>
    </>
  );
};

interface DropdownProps {
  label: string;
  name: string;
  value: any;
  options: any[];
  onChange: (event: DropdownChangeEvent) => void;
}

export const LabeledDropdown = ({
  label,
  name,
  value,
  options,
  onChange,
}: DropdownProps) => {
  return (
    <>
      <div className="form-input-label">{label}</div>
      <Dropdown
        optionLabel="name"
        scrollHeight="400px"
        {...{ name, value, options, onChange }}
      />
    </>
  );
};

interface TextInputButtonProps {
  label: string;
  disabled?: boolean;
  onSubmit?: () => void;
}

export const TextInputButton = ({
  label,
  disabled = false,
  onSubmit = () => undefined,
}: TextInputButtonProps) => {
  const { selectedPass, toast } = useAppContext();
  const [transferPass, setTransferPass] = useState(false);
  const [guestId, setGuestId] = useState("");
  const queryClient = useQueryClient();

  const { mutate: mutateTransferPass, isPending: isTransferPassPending } =
    useMutation({
      mutationKey: ["transferPass", selectedPass.pass_id],
      mutationFn: setPassOwner,
      onError: (error) => {
        showMessage(error.name, error.message, toast, "warn");
      },
      onSuccess: () => {
        setTransferPass(false);
        setGuestId("");
        queryClient.invalidateQueries({ queryKey: ["search"] });
        queryClient.invalidateQueries({
          queryKey: ["pass", selectedPass.pass_id],
        });
        showMessage("Transfer pass", "Success!", toast, "success");
      },
    });

  return (
    <>
      {!transferPass ? (
        <CrudButton
          label={label}
          icon="pi pi-arrow-right-arrow-left"
          iconPos="right"
          style={{ width: "100%" }}
          disabled={disabled}
          onClick={() => {
            setGuestId("");
            setTransferPass(true);
          }}
        />
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutateTransferPass({
              passId: selectedPass.pass_id,
              newGuestId: parseInt(guestId),
            });
            onSubmit();
          }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "6px",
            width: "100%",
            height: "41.5px",
          }}
        >
          <InputText
            autoFocus
            className="p-inputtext-sm"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setTransferPass(false);
              }
            }}
            onBlur={() => setTransferPass(false)}
            placeholder="Guest ID"
            value={guestId}
            style={{ width: "100%" }}
            name="transferPass"
            onChange={(e) => {
              const newValue = e.currentTarget.value.replace(/[^0-9]/g, "");
              setGuestId(newValue);
            }}
          />
          <Button
            label=""
            rounded
            loading={isTransferPassPending}
            severity="danger"
            style={{ width: "48px" }}
            icon="pi pi-times"
          />
        </form>
      )}
    </>
  );
};
