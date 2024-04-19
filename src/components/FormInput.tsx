import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext"
import { ChangeEventHandler } from "react";

interface InputFieldProps {
  label: string,
  value: string,
  onChange: (value: string) => void,
}

export const InputField: React.FC<InputFieldProps> = ({ label, value, onChange }) => {
  return (
    <>
      <div className="form-text">{label}</div>
      <InputText className="form-text-input" value={value} style={{ padding: 8 }}
        onChange={(e) => onChange(e.target.value)} />
    </>
  );
};

interface FormikFieldProps {
  label: string,
  name: string,
  touched: boolean | undefined,
  value: string,
  error: string | undefined,
  onChange: ChangeEventHandler<HTMLInputElement>,
}

export const FormikField: React.FC<FormikFieldProps> = ({ label, name, touched, value, error, onChange }) => {
  return (
    <>
      <div className="form-text required">
        {label}
      </div>
      {touched && error && (
        <div style={{ color: 'red', display: 'inline-block' }}>{error}</div>
      )}
      <InputText
        className="form-text-input p-inputtext-sm"
        name={name}
        value={value}
        onChange={onChange}
      />
    </>
  );
};

interface DropdownProps {
  label: string,
  value: any,
  options: any[],
  onChange: (event: DropdownChangeEvent) => void,
}

export const LabeledDropdown: React.FC<DropdownProps> = ({ label, value, options, onChange }) => {
  return (
    <>
      <div className="form-text">
        {label}
      </div>
      <Dropdown
        scrollHeight="400px"
        value={value}
        options={options}
        optionLabel="name"
        onChange={(e) => onChange(e.value)}
      />
    </>
  )
}