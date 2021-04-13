import React from "react";
import { Todo } from "./models/Todo";

const initialState: ContextState = {
  state: { todos: [] },
  dispatch: undefined,
};
export const TodosContext = React.createContext(initialState);
type ContextState = {
  state: State;
  dispatch: React.Dispatch<Action> | undefined;
};

type State = {
  todos: Todo[];
};
type Action = {
  type: ActionType;
  payload: Todo | number | undefined;
};

enum ActionType {
  Add,
  Remove,
  RemoveALL,
  Toggle,
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.Add:
      return action.payload instanceof Todo
        ? { todos: [...state.todos, action.payload] }
        : state;

      break;
    case ActionType.Remove:
      return action.payload instanceof Number
        ? { todos: state.todos.filter((todo) => todo.id !== action.payload) }
        : state;
    case ActionType.RemoveALL:
      return { todos: [] };
    case ActionType.Toggle:
      return action.payload instanceof Number
        ? {
            todos: state.todos.map((todo) =>
              todo.id === action.payload
                ? { ...todo, iscomplete: !todo.iscomplete }
                : todo
            ),
          }
        : state;

    default:
      return state;
      break;
  }
};

type TodoProps = {
  children: React.ReactNode;
};

export const TodosProvider = ({ children }: TodoProps) => {
  const [state, dispatch] = React.useReducer(reducer, initialState.state);

  <TodosContext.Provider value={{ state, dispatch }}>
    {children}
  </TodosContext.Provider>;
};
