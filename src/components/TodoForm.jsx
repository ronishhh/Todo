import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewTodo,
  setEditing,
  setFilterStatus,
  setTodoData,
  updateTodo,
} from "../state/TodoSlice";
import { toast } from "react-toastify";

export default function TodoForm() {
  const dispatch = useDispatch();

  const isEditing = useSelector((state) => state.todo.isEditing);
  const todoData = useSelector((state) => state.todo.todoData);
  const todoLists = useSelector((state) => state.todo.todoLists);
  const uniqueUserIds = [
    ...new Set(todoLists.map((todo) => todo.completed.toString())),
  ];
  uniqueUserIds.unshift("All");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const filterBySelect = (e) => {
    dispatch(setFilterStatus(e.target.value));
  };

  const onSubmit = (data) => {
    if (isEditing) {
      const todoPayload = {
        ...todoData,
        ...data,
      };

      const response = dispatch(
        updateTodo({ todoID: todoData.id, data: todoPayload })
      );
      response.then((res) => {
        dispatch(setTodoData(null));
        dispatch(setEditing(false));
        if (res.meta.requestStatus === "rejected") {
          toast.error("Error in updating data");
        }
      });
    } else {
      const response = dispatch(addNewTodo(data));

      response.then((res) => {
        if (res.meta.requestStatus === "rejected") {
          toast.error("Error in adding data");
        }
      });
    }
    reset();
  };

  return (
    <div className="top-bar">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="input-all">
          <input
            id="input-text"
            {...register("title", { required: true })}
            defaultValue={todoData?.title}
          />
          {errors.title && <span>This field is required</span>}
        </div>

        <input
          id="input-btn"
          type="submit"
          value={isEditing ? "Update Todo" : "Add Todo"}
        />
      </form>

      <div className="select" style={{ width: "200px" }}>
        <select {...register("Id")} id="select-filter" onClick={filterBySelect}>
          {uniqueUserIds.map((value, index) => (
            <option key={index} value={value}>
              {value == "true"
                ? "COMPLETED"
                : value == "false"
                ? "NOT COMPLETED"
                : value.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
