import React from "react";

class LegacyTodoList extends React.Component {
  render() {
    const todos = [
      { id: 1, text: "Buy groceries" },
      { id: 2, text: "Walk the dog" },
      { id: 3, text: "Read a book" },
    ];
    return (
      <div style={{ padding: 20, background: "#f9f9f9", borderRadius: 8 }}>
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>Todos</h2>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} style={{ marginBottom: 8, fontSize: 18 }}>
              {todo.text}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default LegacyTodoList; 