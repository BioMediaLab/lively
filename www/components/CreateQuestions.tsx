import React from "react";
import { FieldArray, useFormikContext } from "formik";
import InputField from "./InputField";
import { Button } from "rebass";
import CreateQuestionOptions from "./CreateQuestionOptions";

const CreateQuestions = () => {
  const formik = useFormikContext();
  const questions = formik.values.questions;

  console.log("values", formik.values);

  return (
    <FieldArray
      name="questions"
      render={arrayHelpers => (
        <div>
          <Button
            my={4}
            onClick={() =>
              arrayHelpers.push({ title: `Question`, options: [] })
            }
          >
            Add Question
          </Button>

          {questions.map((question, index) => {
            return (
              <div key={index}>
                <InputField
                  name={`questions[${index}].title`}
                  label="title"
                  placeholder={question.title}
                  css={{ width: "100%", padding: "10px", fontWeight: "bold" }}
                  fontSize={4}
                  mb={4}
                />

                <Button onClick={() => arrayHelpers.remove(index)}>x</Button>

                <CreateQuestionOptions
                  options={question.options}
                  questionIndex={index}
                />
              </div>
            );
          })}
        </div>
      )}
    />
  );
};

export default CreateQuestions;
