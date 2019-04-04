import React from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          <a href="#">
            {user.name} ({user.email})
          </a>
        </li>
      ))}
    </ul>
  );
}

export default UserList;
