import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";
import { GET_QUIZZES } from "./__generated__/GET_QUIZZES";
import QuizList from "../components/QuizList";
import ErrorMessage from "../components/ErrorMessage";
import CreateQuiz from "../components/CreateQuiz";

const GET_QUIZZES_QUERY = gql`
  query GET_QUIZZES($class_id: ID!) {
    classQuizzes(class_id: $class_id) {
      id
      title
    }
  }
`;

const Quizzes = () => {
  const { data, error, loading } = useQuery<GET_QUIZZES>(GET_QUIZZES_QUERY, {
    variables: { class_id: 2 }
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <ErrorMessage apolloErr={error} />;
  }

  return (
    <div>
      <CreateQuiz />
      <QuizList quizzes={data.classQuizzes} />
    </div>
  );
};

export default Quizzes;
