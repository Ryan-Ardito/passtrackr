import { FormikContextType } from "formik";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { ChangeEventHandler, useState } from "react";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
}) => {
  return (
    <>
      <div className="form-input-label">{label}</div>
      <InputText
        className="form-text-input"
        value={value}
        style={{ padding: 8 }}
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

export const MessageRequired: React.FC<MessageRequiredProps> = ({
  touched,
  error,
}) => {
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
  onChange?: ChangeEventHandler<HTMLElement>
}

export const FormikField: React.FC<FormikFieldProps> = ({
  label,
  name,
  formik,
  onChange = formik.handleChange
}) => {
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
  options: any[];
  formik: FormikContextType<any>;
}

export const FormikDropdown: React.FC<FormikDropdownProps> = ({
  label,
  name,
  options,
  formik,
}) => {
  const { values, touched, errors, isSubmitting, handleChange } = formik;

  return (
    <>
      {/* <div className="form-input-label">{label}</div> */}
      <div style={{ display: "flex", gap: "6px" }}>
        <Dropdown
          optionLabel="name"
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

export const LabeledDropdown: React.FC<DropdownProps> = ({
  label,
  name,
  value,
  options,
  onChange,
}) => {
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

export const TextInputButton: React.FC<TextInputButtonProps> = ({
  label,
  disabled,
}) => {
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
