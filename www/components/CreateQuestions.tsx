import React from "react";
import { FieldArray, useFormikContext } from "formik";
import InputField from "./InputField";
import { Flex, Box, Button } from "rebass";
import CreateQuestionOptions from "./CreateQuestionOptions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";

const CreateQuestions = () => {
  const formik = useFormikContext();
  const questions = formik.values.questions;

  console.log("values", formik.values);

  return (
    <FieldArray
      name="questions"
      render={arrayHelpers => (
        <div>
          {questions.map((question, index) => {
            return (
              <div>
                <Flex mb={4}>
                  <Box width={3 / 4} mr={2} key={index}>
                    <InputField
                      name={`questions[${index}].title`}
                      label="title"
                      placeholder={question.title}
                      css={{
                        width: "100%",
                        padding: "10px",
                        fontWeight: "bold"
                      }}
                      fontSize={4}
                    />
                  </Box>

                  <Button
                    width={1 / 4}
                    bg="red"
                    onClick={() => arrayHelpers.remove(index)}
                  >
                    x
                  </Button>
                </Flex>
                <CreateQuestionOptions
                  options={question.options}
                  questionIndex={index}
                />
              </div>
            );
          })}

          <Flex justifyContent="center">
            <Button
              width={1 / 2}
              my={4}
              onClick={() =>
                arrayHelpers.push({ title: `Question`, options: [] })
              }
            >
              Click to Add Question <FontAwesomeIcon icon={faQuestion} />
            </Button>
          </Flex>
        </div>
      )}
    />
  );
};

export default CreateQuestions;
