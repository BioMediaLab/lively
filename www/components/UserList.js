import React, { useState, useEffect } from "react";

function UserList({ users }) {
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
