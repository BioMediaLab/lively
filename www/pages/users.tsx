import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";

import makePage from "../lib/makePage";
import UserList from "../components/UserList";
import ProfilePic from "../components/ProfilePic";
import ErrorMessage from "../components/ErrorMessage";
import { GET_ME } from "./__generated__/GET_ME";
import { GET_USERS } from "./__generated__/GET_USERS";

const GET_USERS_AST = gql`
  query GET_USERS {
    users {
      id
      name
      email
    }
  }
`;

const GET_ME_AST = gql`
  query GET_ME {
    me {
      id
      name
      photo_url
    }
  }
`;

const Users = () => {
  const { data, error, loading } = useQuery<GET_USERS>(GET_USERS_AST);
  const me = useQuery<GET_ME>(GET_ME_AST);

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
