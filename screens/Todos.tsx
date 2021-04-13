import React from "react";
import App from "../App";
import { TodosProvider } from "../TodosContext";
export const Todos = () => (
  <TodosProvider>
    <App />
  </TodosProvider>
);
