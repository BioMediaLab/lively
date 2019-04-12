import React from "react";
import { useField } from "formik";

import Field from "./Field";
import Input from "./Input";

const InputField = ({ label, name, onChange, ...props }) => {
  const [field, meta] = useField(name);
  const errorText = meta.touch && meta.error;

  return (
    <Field label={label} errorText={errorText}>
      <Input {...field} {...props} error={!!errorText} />
    </Field>
  );
};

export default InputField;
