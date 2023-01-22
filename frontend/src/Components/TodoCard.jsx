import React from "react";

export default function TodoCard(props) {
  return (
    <div
      style={{
        border: "2px solid black",
        padding: "15px",
        display: "inline-block",
        margin: "20px",
      }}
    >
      <h1>{props.todoItem}</h1>
      <button onClick={() => props.delete(props.id)}>Delete</button>
    </div>
  );
}
