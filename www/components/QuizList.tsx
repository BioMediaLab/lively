import React from "react";

interface Quiz {
  id: string;
  title: string;
}

function QuizList({ quizzes }: { quizzes: Quiz[] }) {
  return (
    <ul>
      {quizzes.map(quiz => (
        <li key={quiz.id}>
          <a href="#">{quiz.title}</a>
        </li>
      ))}
    </ul>
  );
}

export default QuizList;
