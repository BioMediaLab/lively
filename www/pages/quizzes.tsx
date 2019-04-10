import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";
import makePage from "../lib/makePage";
import QuizList from "../components/QuizList";

const GET_QUIZZES = gql`
  {
    quizzes {
      id
    }
  }
`;

const Quizzes = () => {
  const { data, error, loading } = useQuery(GET_QUIZZES);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error! {error.message}</div>;
  }

  return (
    <div>
      <QuizList quizzes={data.quizzes} />
    </div>
  );
};

export default makePage(Quizzes);
