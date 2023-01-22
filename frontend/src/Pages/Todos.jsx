import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "../redux-toolkit/authSlice";
import {
  getTodosThunk,
  addTodoThunk,
  deleteTodoThunk,
} from "../redux-toolkit/todoSlice";
import AddTodo from "../Components/AddTodo";
import TodoCard from "../Components/TodoCard";

export default function Todos() {
  const todos = useSelector((store) => store.todos.todoList);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTodosThunk());
  }, [dispatch]);

  return (
    <div>
      <button onClick={() => dispatch(logoutThunk())}>Logout</button>
      {todos.map((obj) => (
        <div key={obj.id}>
          <TodoCard
            todoItem={obj.todo}
            id={obj.id}
            delete={(id) => dispatch(deleteTodoThunk(id))}
          />
        </div>
      ))}
      <AddTodo
        newTodo={(todo) => {
          dispatch(addTodoThunk(todo));
        }}
      />
    </div>
  );
}
