import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";
import UserList from "../components/UserList";
import ProfilePic from "../components/ProfilePic";
import makePage from "../lib/makePage";
import { GET_USERS } from "./__generated__/GET_USERS";
import ErrorMessage from "../components/ErrorMessage";

const GET_USERS_AST = gql`
  query GET_USERS {
    users {
      id
      name
      email
      photo
    }
  }
`;

const GET_ME = gql`
  query GET_USERS {
    me {
      id
      name
      photo
    }
  }
`;

const Users = () => {
  const { data, error, loading } = useQuery<GET_USERS>(GET_USERS_AST);
  const me = useQuery<GET_USERS>(GET_ME);

  if (loading || me.loading) {
    return <div>Loading...</div>;
  }

  if (error || !data || me.error || !me.data) {
    return <ErrorMessage apolloErr={error} />;
  }

  return (
    <div>
      <UserList users={data.users} />
      <ProfilePic user={me.data.me} />
    </div>
  );
};

export default makePage(Users);
