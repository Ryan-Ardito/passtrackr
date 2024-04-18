import { InputText } from "primereact/inputtext"

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