import { useQuery, useMutation, gql } from "@apollo/client";
import { useState } from "react";
const GET_TODOS = gql`
  query getTodos {
    todos {
      done
      id
      text
    }
  }
`;

const TOGGLE_TODO = gql`
  mutation toggleTodo($id: uuid!, $done: Boolean!) {
    update_todos(where: { id: { _eq: $id } }, _set: { done: $done }) {
      returning {
        done
        id
        text
      }
    }
  }
`;

const ADD_TODO = gql`
  mutation addTodo($text: String!) {
    insert_todos(objects: { text: $text }) {
      returning {
        done
        id
        text
      }
    }
  }
`;

export default function App() {
  const [todoText, setTodoText] = useState("");
  const { data, loading, error } = useQuery(GET_TODOS);
  const [toggleTodo] = useMutation(TOGGLE_TODO);
  const [addTodo] = useMutation(ADD_TODO, {
    onCompleted: () => setTodoText("")
  });

  async function handleToggleTodo({ id, done }) {
    const data = await toggleTodo({ variables: { id: id, done: !done } });
    console.log(`toggle todo ${data}`);
  }

  async function handleAddTodo(event) {
    event.preventDefault();
    if (!todoText.trim()) return;
    const data = await addTodo({
      variables: { text: todoText },
      refetchQueries: [{ query: GET_TODOS }]
    });
    console.log(`added todo ${data}`);
  }
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching todos!</div>;
  return (
    <div className="vh-100 code flex flex-column items-center bg-purple white pa3 fl-1">
      <h1 className="f2-l">
        GraphQL CheckList{" "}
        <span role="img" aria-label="Checkmark">
          &#9989;
        </span>
      </h1>
      <form onSubmit={handleAddTodo} className="mb3">
        <input
          className="pa2 f4 b--dashed"
          type="text"
          placeholder="todo"
          onChange={(e) => setTodoText(e.target.value)}
          value={todoText}
        />
        <button className="pa2 f4 bg-green" type="Submit">
          Create
        </button>
      </form>
      <div className="flex items-center justify-center flex-column">
        {data.todos.map((todo) => (
          <p onDoubleClick={() => handleToggleTodo(todo)} key={todo.id}>
            <span className={`pointer list pa1 f3 ${todo.done && "strike"}`}>
              {todo.text}
            </span>
            <button className="bg-transparent bn f4">
              <span className="red">&times;</span>
            </button>
          </p>
        ))}
      </div>
    </div>
  );
}
