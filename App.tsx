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

import Swipeable from "react-native-gesture-handler/Swipeable";
import { FlatList, ScrollView } from "react-native-gesture-handler";

import { Todo } from "./models/Todo";
import BottomSheetBehavior from "reanimated-bottom-sheet";

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#3498db",
    accent: "#f1c40f",
  },
};

interface DeleteTodo {
  index: number;
  todo: Todo;
}

const chipTypes = ["All", "Incomplete", "Completed"];

export default function App() {
  const [visible, setVisible] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>("");
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [searchedTodos, setSearchedTodos] = React.useState<Todo[]>([]);
  const [showBanner, setShowBanner] = React.useState<boolean>(false);
  const [visibleSnackBar, setVisibleSnackbar] = React.useState(false);
  const [delTodo, setDelTodo] = React.useState<DeleteTodo>();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);
  const onAdd = (todo: Todo) => setTodos((prevTodos) => [...prevTodos, todo]);
  const onChangeSearch = (search: string) => setSearch(search);

  React.useEffect(() => {
    const getBool: (arg0: Todo) => boolean = (todo) => {
      switch (selectedIndex) {
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
    setSearchedTodos(
      todos.filter(
        (todo) =>
          todo.textLower().includes(search.toLowerCase()) && getBool(todo)
      )
    );
  }, [search, todos, selectedIndex]);

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
    setDelTodo({ index: todos.findIndex((to) => todo === to), todo });
    setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
    setVisibleSnackbar(true);
  };

  const completeTodo = (todo: Todo) => {
    setTodos((prevTodos) =>
      prevTodos.map((t) => (t !== todo ? t : new Todo(t.text, true)))
    );
  };

  const undoTodo = (deleteTodo?: DeleteTodo) => {
    if (deleteTodo !== undefined) {
      setTodos((prevTodos) => [...prevTodos, deleteTodo.todo]);
    }
  };

  const renderItem: ListRenderItem<Todo> = ({ item }) => (
    <Swipeable
      renderLeftActions={(a1, a2) => (
        <RenderLeftActions
          onPress={() => {
            completeTodo(item);
          }}
        />
      )}
      renderRightActions={(a1, a2) => (
        <RenderRightActions
          onPress={() => {
            deleteTodo(item);
          }}
        />
      )}
      overshootLeft={false}
    >
      <Card>
        <Card.Content>
          <Title>{item.text}</Title>
          <Subheading>
            {item.iscomplete ? "Completed" : "Incomplete"}
          </Subheading>
        </Card.Content>
      </Card>
    </Swipeable>
  );
  const deleteCompleted = () =>
    setTodos((prevTodos) => prevTodos.filter((todo) => !todo.iscomplete));
  const toggleBanner = () => setShowBanner((prevShow) => !prevShow);
  const onDismissSnackBar = () => setVisibleSnackbar(false);
  const renderContent = () => <Title>Hello</Title>;
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
          todos.filter((todo) => todo.iscomplete).length > 0
            ? [
                {
                  label: "Delete Completed Todos",
                  onPress: deleteCompleted,
                },
              ]
            : []
        }
      >
        {`Total Todos: ${todos.length}, Total Incomplete Todos: ${
          todos.filter((todo) => !todo.iscomplete).length
        }`}
      </Banner>
      {todos.length === 0 ? (
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
            data={searchedTodos}
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

      <InputDialog isVisible={visible} onDismiss={hideDialog} onAdd={onAdd} />

      <FAB style={styles.fab} icon="plus" onPress={showDialog} />
      <Snackbar
        visible={visibleSnackBar}
        onDismiss={onDismissSnackBar}
        action={{
          label: "Undo",
          onPress: () => {
            undoTodo(delTodo);
          },
        }}
      >
        Restore the Todo?
      </Snackbar>
    </Provider>
  );
}
interface ActionsProps {
  onPress: () => void;
}

const RenderLeftActions = ({ onPress }: ActionsProps) => {
  const { colors } = useTheme();
  return (
    <Button
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.accent,
      }}
      icon="check"
      onPress={onPress}
      labelStyle={{ color: colors.text }}
    >
      Complete
    </Button>
  );
};

const RenderRightActions = ({ onPress }: ActionsProps) => {
  const { colors } = useTheme();
  return (
    <Button
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.error,
      }}
      labelStyle={{ color: colors.surface }}
      icon="delete"
      onPress={onPress}
    >
      Delete
    </Button>
  );
};

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
