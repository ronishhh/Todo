import { useDispatch, useSelector } from "react-redux";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import { useEffect, useMemo, useState } from "react";
import { fetchTodoList, setEditing } from "../state/TodoSlice";

const index = () => {
  const dispatch = useDispatch();
  const { todoLists, filterStatus } = useSelector((state) => state.todo);

  useEffect(() => {
    dispatch(fetchTodoList());
  }, [dispatch]);

  const filteredData = useMemo(() => {
    if (filterStatus === "All") {
      return todoLists;
    } else {
      return todoLists.filter(
        (todo) => todo.completed.toString() === filterStatus
      );
    }
  }, [todoLists, filterStatus]);

  function editData() {
    dispatch(setEditing(true));
  }

  return (
    <div className="todo-items">
      <h2 id="title">Todo List</h2>
      <TodoForm />
      <TodoList todos={filteredData} editData={editData} />
    </div>
  );
};

export default index;
