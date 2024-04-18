import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext"

interface InputFieldProps {
  label: string,
  value: string,
  onChange: (value: string) => void,
}

interface DropdownProps {
  label: string,
  value: any,
  options: any[],
  dropdownHandler: (event: DropdownChangeEvent) => void,
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

export const LabeledDropdown: React.FC<DropdownProps> = ({ label, value, options, dropdownHandler }) => {
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
        onChange={(e) => dropdownHandler(e.value)}
      />
    </>
  )
}