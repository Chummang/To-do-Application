import React, { useState } from "react";

export default function AddTodo(props) {
  const [todoItem, setTodoItem] = useState("");

  const handleChange = (event) => {
    setTodoItem(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        name="title"
        placeholder="Link Title"
        onChange={handleChange}
        value={todoItem}
      />
      <button
        onClick={() => {
          props.newTodo(todoItem);
          setTodoItem("");
        }}
      >
        Add Todo Item
      </button>
    </div>
  );
}
