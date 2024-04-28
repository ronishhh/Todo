import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosConfig";

export const addNewTodo = createAsyncThunk("addNewTodo", async (newTodo) => {
  try {
    const final = {
      ...newTodo,
      completed: false,
      userId: 1,
    };
    const response = await axiosInstance.post("/todos", final);
    return response.data;
  } catch (error) {
    console.error("Error in storing new data", error);
    throw error;
  }
});

export const fetchTodoList = createAsyncThunk("fetchTodos", async () => {
  try {
    const response = await axiosInstance.get(`/todos`);
    return response.data;
  } catch (error) {
    console.error("Error fetching todo list", error);
    throw error;
  }
});

export const toggleTodo = createAsyncThunk(
  "toggleTodo",
  async ({ todoID, todo }) => {
    try {
      const data = {
        ...todo,
        completed: !todo.completed,
      };
      const response = await axiosInstance.put(`/todos/${todoID}`, data);
      return response.data;
    } catch (error) {
      console.error("Error in updating todo status", error);
      throw error;
    }
  }
);

export const deleteTodo = createAsyncThunk("deleteTodo", async (todoID) => {
  try {
    axiosInstance.delete(`todos/${todoID}`);
    return todoID;
  } catch (error) {
    console.error("Error in deleting todo", error);
    throw error;
  }
});

export const updateTodo = createAsyncThunk(
  "updateTodo",
  async ({ todoID, data }) => {
    try {
      const response = await axiosInstance.put(`/todos/${todoID}`, data);
      return response.data;
    } catch (error) {
      console.error("Error in updating todo", error);
      throw error;
    }
  }
);

const todoSlice = createSlice({
  name: "todo",
  initialState: {
    todoLists: [],
    isEditing: false,
    todoData: null,
    filterStatus: "All",
  },
  reducers: {
    setEditing: (state, action) => {
      state.isEditing = action.payload;
    },
    setTodoData: (state, action) => {
      state.todoData = action.payload;
    },
    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodoList.fulfilled, (state, action) => {
      state.todoLists = action.payload;
    });

    builder.addCase(toggleTodo.fulfilled, (state, action) => {
      const toggledTodo = action.payload;
      state.todoLists = state.todoLists.map((todo) =>
        todo.id === toggledTodo.id ? toggledTodo : todo
      );
    });
    builder.addCase(addNewTodo.fulfilled, (state, action) => {
      const newTodo = action.payload;
      state.todoLists.unshift(newTodo);
    });
    builder.addCase(deleteTodo.fulfilled, (state, action) => {
      const id = action.payload;
      const index = state.todoLists.findIndex((todo) => todo.id === id);
      if (index !== -1) {
        state.todoLists.splice(index, 1);
      }
    });
    builder.addCase(updateTodo.fulfilled, (state, action) => {
      const updatedTodo = action.payload;
      state.todoLists = state.todoLists.map((todo) =>
        todo.id == updatedTodo.id ? updatedTodo : todo
      );
    });
  },
});

export const { setEditing, setTodoData, setFilterStatus } = todoSlice.actions;

export default todoSlice.reducer;
