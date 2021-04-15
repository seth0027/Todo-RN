import React from "react";
import { Platform } from "react-native";
import { Button, Dialog, TextInput, Title } from "react-native-paper";
import { Todo } from "../models/Todo";
const isWeb = Platform.OS === "web";
interface InputProps {
  isVisible: boolean;
  onDismiss: () => void;
  onAdd: (arg0: Todo) => void;
}
export function InputDialog({ isVisible, onDismiss, onAdd }: InputProps) {
  const [todo, setTodo] = React.useState<string>("");

  return (
    <Dialog
      visible={isVisible}
      onDismiss={onDismiss}
      style={{
        width: isWeb ? "40%" : "80%",
        alignSelf: "center",
      }}
    >
      <Dialog.Title>
        <Title>Add</Title>
      </Dialog.Title>
      <Dialog.Content>
        <TextInput
          style={{ backgroundColor: "transparent" }}
          label="Todo"
          value={todo}
          onChangeText={(todo) => setTodo(todo)}
        />
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onDismiss}>Cancel</Button>
        <Button
          onPress={() => {
            onAdd(new Todo(todo.trim()));
            setTodo("");
            onDismiss();
          }}
          disabled={todo.trim().length === 0}
        >
          Add
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}
