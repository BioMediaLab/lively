import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";
import UserList from "../components/UserList";
import ProfilePic from "../components/ProfilePic";
import makePage from "../lib/makePage";
import { GET_USERS } from "./__generated__/GET_USERS";
import ErrorMessage from "../components/ErrorMessage";

const GET_USERS = gql`
  query GET_USERS {
    users {
      id
      name
      email
    }
  }
`;

const Users = () => {
  const { data, error, loading } = useQuery<GET_USERS>(GET_USERS);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <ErrorMessage apolloErr={error} />;
  }

  return (
    <div>
      <UserList users={data.users} />
      <ProfilePic />
    </div>
  );
};

export default makePage(Users);
