import React from "react";

import { Todo } from "./models/Todo";

const initialState: ContextState = {
  state: { todos: [], searchedTodos: [] },
  dispatch: () => {},
};
export const TodosContext = React.createContext(initialState);
type ContextState = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

type State = {
  todos: Todo[];
  lastDeleted?: DeleteTodo;
  searchedTodos: Todo[];
};
type Action = {
  type: ActionType;
  payload?: Todo | number;
  search?: { search: string; selectedIndex: number };
};

class DeleteTodo {
  index: number;
  todo?: Todo;
  constructor(index: number, todo: Todo) {
    this.index = index;
    this.todo = todo;
  }
}

export enum ActionType {
  Add,
  Remove,
  RemoveALL,
  Toggle,
  Undo,
  RemoveCompleted,
  Search,
}

const reducer = (state: State, action: Action): State => {
  console.log(
    "Add dispatcher called searched, Todos: ",
    state.searchedTodos,
    "Action: ",
    action.type
  );
  switch (action.type) {
    case ActionType.Add:
      {
        return action.payload instanceof Todo
          ? { ...state, todos: [...state.todos, action.payload] }
          : state;
      }

      break;
    case ActionType.Remove: {
      return typeof action.payload === "number"
        ? {
            ...state,
            todos: state.todos.filter((todo) => todo.id !== action.payload),

            lastDeleted: {
              index: state.todos.findIndex(
                (todo) => todo.id === action.payload
              ),
              todo: state.todos.find((todo) => todo.id === action.payload),
            },
          }
        : state;
    }

    case ActionType.RemoveALL:
      return { ...state, todos: [] };
    case ActionType.Toggle:
      return typeof action.payload === "number"
        ? {
            todos: state.todos.map((todo) =>
              todo.id === action.payload
                ? { ...todo, iscomplete: !todo.iscomplete }
                : todo
            ),
            searchedTodos: state.searchedTodos,
          }
        : state;
    case ActionType.Undo:
      return state.lastDeleted && state.lastDeleted.todo
        ? {
            ...state,
            todos: [
              ...state.todos.splice(
                state.lastDeleted.index,
                0,
                state.lastDeleted.todo
              ),
              ...state.todos,
            ],
          }
        : state;
    case ActionType.RemoveCompleted:
      return {
        ...state,
        todos: state.todos.filter((todo) => !todo.iscomplete),
      };
    case ActionType.Search: {
      if (action.search) {
        const getBool: (arg0: Todo) => boolean = (todo) => {
          switch (action.search?.selectedIndex) {
            case 0:
              return true;

            case 1:
              return !todo.iscomplete;

            case 2:
              return todo.iscomplete;

            default:
              return true;
          }
        };
        return {
          ...state,

          searchedTodos: state.todos.filter((todo) => {
            const search = action.search?.search ?? "";
            return (
              todo.textLower().includes(search.toLowerCase()) && getBool(todo)
            );
          }),
        };
      } else return state;
    }

    default:
      return state;
  }
};

type TodoProps = {
  children: React.ReactNode;
};

export const TodosProvider = ({ children }: TodoProps) => {
  const [state, dispatch] = React.useReducer(reducer, initialState.state);

  return (
    <TodosContext.Provider value={{ state, dispatch }}>
      {children}
    </TodosContext.Provider>
  );
};
