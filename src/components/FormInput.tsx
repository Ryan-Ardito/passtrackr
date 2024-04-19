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
  value: string,
  touched: boolean | undefined,
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
      <InputText style={{ padding: 8}}
        className="form-text-input"
        name={name}
        value={value}
        onChange={onChange}
      />
    </>
  );
};

interface FormikDropdownProps {
  label: string,
  name: string,
  value: any,
  touched: boolean | undefined,
  error: string | undefined,
  options: any[],
  onChange: (event: DropdownChangeEvent) => void,
}

export const FormikDropdown: React.FC<FormikDropdownProps> = ({ label, name, value, touched, error, options, onChange }) => {
  return (
    <>
      <div></div>
      <div className="form-text required">
        {label}
      </div>
      {touched && error && (
        <div style={{ color: 'red', display: 'inline-block' }}>{error}</div>
      )}
      <div></div>
      <Dropdown
        name={name}
        scrollHeight="400px"
        value={value}
        options={options}
        optionLabel="name"
        onChange={(e) => onChange(e)}
      />
    </>
  )
}

interface DropdownProps {
  label: string,
  name: string,
  value: any,
  options: any[],
  onChange: (event: DropdownChangeEvent) => void,
}

export const LabeledDropdown: React.FC<DropdownProps> = ({ label, name, value, options, onChange }) => {
  return (
    <>
      <div className="form-text">
        {label}
      </div>
      <Dropdown
        name={name}
        scrollHeight="400px"
        value={value}
        options={options}
        optionLabel="name"
        onChange={(e) => onChange(e)}
      />
    </>
  )
}