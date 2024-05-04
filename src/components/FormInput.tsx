import { FormikContextType } from "formik";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { ChangeEventHandler, KeyboardEventHandler, useState } from "react";

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
          error={errors[name]?.toString()}
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
}

export const TextInputButton = ({ label, disabled }: TextInputButtonProps) => {
  const [addVisits, setAddVisits] = useState(false);

  return (
    <>
      {!addVisits ? (
        <Button
          label={label}
          icon="pi pi-plus"
          iconPos="right"
          disabled={disabled}
          onClick={() => setAddVisits(true)}
        />
      ) : (
        <form
          style={{
            display: "flex",
            gap: "6px",
            width: "100%",
            height: "41.5px",
          }}
        >
          <InputText
            autoFocus
            style={{ width: "100%" }}
            name="addVisit"
            onChange={() => null}
          />
          <Button
            style={{ width: "48px" }}
            icon="pi pi-plus"
            onClick={() => setAddVisits(false)}
          />
        </form>
      )}
    </>
  );
};
