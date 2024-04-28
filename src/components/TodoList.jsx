import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { deleteTodo, setTodoData, toggleTodo } from "../state/TodoSlice";
import { useCallback, useEffect, useState } from "react";

const TodoList = ({ todos, editData }) => {
  const dispatch = useDispatch();
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const isEditing = useSelector((state) => state.todo.isEditing);

  const toggleTodoStatus = useCallback(
    (todoID, todo) => {
      const response = dispatch(toggleTodo({ todoID, todo }));
      response.then((res) => {
        if (res.meta.requestStatus === "rejected") {
          toast.error("Could not complete request");
        }
      });
    },
    [dispatch]
  );

  const removeTodo = useCallback(
    (todoID) => {
      const response = dispatch(deleteTodo(todoID));
      response.then((res) => {
        if (res.meta.requestStatus === "rejected") {
          toast.error("Error while deleting");
        }
      });
    },
    [dispatch]
  );

  const updateTodo = useCallback(
    (todo, index) => {
      editData();
      setSelectedItemIndex(index);
      dispatch(setTodoData(todo));
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    [dispatch, editData]
  );

  useEffect(() => {
    if (!isEditing) {
      setSelectedItemIndex(null);
    }
  }, [isEditing]);

  return (
    <div>
      <ul className="items">
        {todos.map((todo, index) => (
          <div
            key={index}
            className="list"
            id={selectedItemIndex === index ? "selected" : ""}
          >
            <label className="container">
              <input
                type="checkbox"
                checked={todo.completed}
                id="checkbox"
                onChange={() => {
                  toggleTodoStatus(todo.id, todo);
                }}
              />
              <span className="checkmark"></span>
            </label>
            <li
              id="item"
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                color: todo.completed
                  ? "rgba(255, 255, 255, 0.57)"
                  : "rgba(255, 255, 255, 0.87)",
              }}
            >
              {todo.title}
            </li>
            <div className="action-btns">
              <button
                onClick={() => {
                  removeTodo(todo.id);
                }}
              >
                Delete
              </button>
              <button
                onClick={() => {
                  updateTodo(todo, index);
                }}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
