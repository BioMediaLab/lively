import React from "react";
import { useFormik, FormikProvider } from "formik";
import Fieldset from "./Fieldset";

const Form = ({
  initialValues,
  validationSchema,
  onSubmit,
  children,
  ...props
}) => {
  const formik = useFormik({ initialValues, validationSchema, onSubmit });

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} {...props}>
        <Fieldset disabled={formik.isSubmitting}>{children}</Fieldset>
      </form>
    </FormikProvider>
  );
};

export default Form;
