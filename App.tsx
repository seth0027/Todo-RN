import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Animated, ListRenderItem, View } from "react-native";
import {
  Appbar,
  FAB,
  Title,
  Dialog,
  Portal,
  TextInput,
  Button,
  Card,
  Provider,
  DefaultTheme,
  TouchableRipple,
  Searchbar,
  Divider,
  useTheme,
  Subheading,
  Badge,
  Snackbar,
  Banner,
  Surface,
  Chip,
  withTheme,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TodosContext, ActionType } from "./TodosContext";

import { FlatList, ScrollView } from "react-native-gesture-handler";

import { Todo } from "./models/Todo";
import { TodoItem } from "./screens/TodoItem";

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#3498db",
    accent: "#f1c40f",
  },
};

const chipTypes = ["All", "Incomplete", "Completed"];

export default function App() {
  const [visible, setVisible] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>("");
  const { state, dispatch } = React.useContext(TodosContext);
  const [showBanner, setShowBanner] = React.useState<boolean>(false);
  const [visibleSnackBar, setVisibleSnackbar] = React.useState(false);

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const onChangeSearch = (search: string) => setSearch(search);

  React.useEffect(() => {
    dispatch({
      type: ActionType.Search,
      search: {
        selectedIndex,
        search,
      },
    });
  }, [search, state.todos, selectedIndex]);

  React.useEffect(() => {
    const out = setTimeout(
      () => setShowBanner((prev) => (prev ? false : prev)),
      2000
    );
    return () => clearTimeout(out);
  }, [showBanner]);

  React.useEffect(() => {
    const out = setTimeout(() => {
      if (visibleSnackBar) onDismissSnackBar();
    }, 2000);
    return () => clearTimeout(out);
  }, [visibleSnackBar]);

  const deleteTodo = (todo: Todo) => {
    dispatch({ type: ActionType.Remove, payload: todo.id });

    setVisibleSnackbar(true);
  };

  const completeTodo = (todo: Todo) => {
    dispatch({ type: ActionType.Toggle, payload: todo.id });
  };

  const renderItem: ListRenderItem<Todo> = ({ item }) => (
    <TodoItem
      item={item}
      onCompletePress={completeTodo}
      onDeletePress={deleteTodo}
    />
  );
  const toggleBanner = () => setShowBanner((prevShow) => !prevShow);
  const onDismissSnackBar = () => setVisibleSnackbar(false);
  return (
    <Provider theme={theme}>
      <Appbar.Header>
        <Appbar.Content
          title="Todos"
          subtitle="Todo App"
          titleStyle={{ fontSize: 24 }}
        />

        <Appbar.Action icon="progress-check" onPress={toggleBanner} />
      </Appbar.Header>
      <Banner
        visible={showBanner}
        icon="progress-check"
        actions={
          state.todos.filter((todo) => todo.iscomplete).length > 0
            ? [
                {
                  label: "Delete Completed Todos",
                  onPress: () => {
                    dispatch({ type: ActionType.RemoveCompleted });
                  },
                },
              ]
            : []
        }
      >
        {`Total Todos: ${state.todos.length}, Total Incomplete Todos: ${
          state.todos.filter((todo) => !todo.iscomplete).length
        }`}
      </Banner>
      {state.todos.length === 0 ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Title style={{ textAlign: "center", marginHorizontal: 30 }}>
            Start adding Todos by tapping plus button {"  "}
            <MaterialCommunityIcons name="restart" size={24} />
          </Title>
        </View>
      ) : (
        <>
          <Searchbar
            style={{ margin: 10 }}
            placeholder="Search Todo"
            onChangeText={onChangeSearch}
            value={search}
          />
          <View>
            <ScrollView horizontal>
              {chipTypes.map((text, index) => (
                <Chip
                  style={{ margin: 10 }}
                  key={index}
                  onPress={() => {
                    setSelectedIndex(index);
                  }}
                  selected={index === selectedIndex}
                >
                  {text}
                </Chip>
              ))}
            </ScrollView>
          </View>

          <FlatList
            data={state.searchedTodos}
            keyExtractor={(item) => String((item as Todo).id)}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <Divider />}
            ListEmptyComponent={() => (
              <Title style={{ textAlign: "center", margin: 20 }}>
                <MaterialCommunityIcons name="account-search" size={24} /> No
                results found!
              </Title>
            )}
          />
        </>
      )}

      <InputDialog
        isVisible={visible}
        onDismiss={hideDialog}
        onAdd={(todo) => {
          dispatch({ type: ActionType.Add, payload: todo });
        }}
      />

      <FAB style={styles.fab} icon="plus" onPress={showDialog} />
      <Snackbar
        visible={visibleSnackBar}
        onDismiss={onDismissSnackBar}
        action={{
          label: "Undo",
          onPress: () => {
            dispatch({ type: ActionType.Undo });
          },
        }}
      >
        Restore the Todo?
      </Snackbar>
    </Provider>
  );
}

interface InputProps {
  isVisible: boolean;
  onDismiss: () => void;
  onAdd: (arg0: Todo) => void;
}
function InputDialog({ isVisible, onDismiss, onAdd }: InputProps) {
  const [todo, setTodo] = React.useState<string>("");

  return (
    <Dialog visible={isVisible} onDismiss={onDismiss}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 16,
  },
});
