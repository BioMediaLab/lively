import gql from "graphql-tag";
import { useQuery } from "react-apollo-hooks";
import UserList from "../components/UserList";
import ProfilePic from "../components/ProfilePic";
import makePage from "../lib/makePage";

const GET_USERS = gql`
  {
    users {
      id
      name
      email
    }
  }
`;

const Users = () => {
  const { data, error, loading } = useQuery(GET_USERS);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error! {error.message}</div>;
  }

  return (
    <div>
      <UserList users={data.users} />
      <ProfilePic />
    </div>
  );
};

export default makePage(Users);
