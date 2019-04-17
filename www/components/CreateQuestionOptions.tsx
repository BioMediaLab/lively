import React from "react";
import { FieldArray } from "formik";
import InputField from "./InputField";
import { Button } from "rebass";

const CreateQuestionOptions = ({ options, questionIndex }) => {
  return (
    <FieldArray
      name={`questions[${questionIndex}].options`}
      render={arrayHelpers => (
        <div>
          <Button my={4} onClick={() => arrayHelpers.push({ title: `Option` })}>
            Add Option
          </Button>

          {options &&
            options.map((option, index) => {
              return (
                <div key={index}>
                  <InputField
                    name={`questions[${questionIndex}].options[${index}].title`}
                    label="title"
                    placeholder={option.title}
                    css={{ width: "100%", padding: "10px", fontWeight: "bold" }}
                    fontSize={4}
                    mb={4}
                  />

                  <Button onClick={() => arrayHelpers.remove(index)}>x</Button>
                </div>
              );
            })}
        </div>
      )}
    />
  );
};

export default CreateQuestionOptions;
