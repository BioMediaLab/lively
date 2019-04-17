import React from "react";
import { FieldArray, useFormikContext } from "formik";
import InputField from "./InputField";
import { Button } from "rebass";

const CreateQuestions = () => {
  const formik = useFormikContext();
  const questions = formik.values.questions;

  console.log(questions);

  return (
    <FieldArray
      name="questions"
      render={arrayHelpers => (
        <div>
          <Button
            my={4}
            onClick={() => arrayHelpers.push({ title: `Question` })}
          >
            Add Question
          </Button>

          {questions.map((question, index) => {
            return (
              <InputField
                key={index}
                name={`question[${index}]`}
                label="title"
                placeholder={question.title}
                css={{ width: "100%", padding: "10px", fontWeight: "bold" }}
                fontSize={4}
                mb={4}
              />
            );
          })}
        </div>
      )}
    />
  );
};

export default CreateQuestions;
