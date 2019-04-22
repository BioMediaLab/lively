import React from "react";
import { FieldArray } from "formik";
import InputField from "./InputField";
import { Flex, Box, Button } from "rebass";

const CreateQuestionOptions = ({ options, questionIndex }) => {
  return (
    <FieldArray
      name={`questions[${questionIndex}].options`}
      render={arrayHelpers => (
        <div>
          {options &&
            options.map((option, index) => {
              return (
                <Flex mb={2}>
                  <Box width={3 / 4} mr={2} key={index}>
                    <InputField
                      name={`questions[${questionIndex}].options[${index}].title`}
                      label="title"
                      placeholder={option.title}
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
              );
            })}

          <Button
            my={4}
            onClick={() =>
              arrayHelpers.push({ title: `Option ${options.length + 1}` })
            }
          >
            Add Option
          </Button>
        </div>
      )}
    />
  );
};

export default CreateQuestionOptions;
