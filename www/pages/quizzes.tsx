import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";
import { GET_QUIZZES } from "./__generated__/GET_QUIZZES";
import QuizList from "../components/QuizList";
import ErrorMessage from "../components/ErrorMessage";
import CreateQuiz from "../components/CreateQuizForm";
import Container from "../components/Container";

export const GET_QUIZZES_QUERY = gql`
  query GET_QUIZZES($class_id: ID!) {
    classQuizzes(class_id: $class_id) {
      id
      class_id
      title
    }
  }
`;

const Quizzes = () => {
  const { data, error, loading } = useQuery<GET_QUIZZES>(GET_QUIZZES_QUERY, {
    variables: { class_id: 2 }
  });

  const updateClassQuizzesCache = (cache, { data: { createQuiz } }) => {
    const { classQuizzes } = cache.readQuery({
      query: GET_QUIZZES_QUERY,
      variables: {
        class_id: 2
      }
    });

    console.log(classQuizzes);

    console.log(createQuiz);

    cache.writeQuery({
      query: GET_QUIZZES_QUERY,
      variables: {
        class_id: 2
      },
      data: { classQuizzes: [...classQuizzes, createQuiz] }
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <ErrorMessage apolloErr={error} />;
  }

  return (
    <Container>
      <CreateQuiz updateCache={updateClassQuizzesCache} />
      <QuizList quizzes={data.classQuizzes} />
    </Container>
  );
};

export default Quizzes;
