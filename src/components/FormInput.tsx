import { FormikContextType } from "formik";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
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

interface LabelRequiredProps {
  label: string,
  touched: any,
  error: string | undefined,
}

export const LabelRequired: React.FC<LabelRequiredProps> = ({ label, touched, error }) => {
  return (
    <>
      <div></div>
      <div className="form-text required">
        {label}
      </div>
      {touched && error && (
        <div style={{ color: 'red', display: 'inline-block' }}>{error}</div>
      )}
    </>
  );
};

interface FormikFieldProps {
  label: string,
  name: string,
  formik: FormikContextType<any>,
}

export const FormikField: React.FC<FormikFieldProps> = ({ label, name, formik }) => {
  const { values, touched, errors, isSubmitting, handleChange } = formik;

  return (
    <>
      <LabelRequired label={label} error={errors[name]?.toString()} touched={touched[name]?.valueOf()} />
      <InputText style={{ padding: 8 }} className="form-text-input"
        disabled={isSubmitting} name={name} value={values[name]} onChange={handleChange}
      />
    </>
  );
};

interface FormikDropdownProps {
  label: string,
  name: string,
  options: any[],
  formik: FormikContextType<any>,
}

export const FormikDropdown: React.FC<FormikDropdownProps> = ({ label, name, options, formik }) => {
  const { values, touched, errors, isSubmitting, handleChange } = formik;

  return (
    <>
      <div></div>
      <LabelRequired error={errors[name]?.toString()} {...{ label, touched }} />
      <div></div>
      <Dropdown optionLabel="name" scrollHeight="400px" options={options}
        disabled={isSubmitting} name={name} value={values[name]} onChange={handleChange}
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
      <Dropdown optionLabel="name" scrollHeight="400px"
        {...{ name, value, options, onChange }}
      />
    </>
  )
}