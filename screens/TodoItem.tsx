import React from "react";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Card, Title, Subheading, useTheme, Button } from "react-native-paper";
import { Todo } from "../models/Todo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Platform, StyleProp, View, ViewStyle } from "react-native";

const isWeb = Platform.OS === "web";

interface ActionsProps {
  onPress: () => void;
  item?: Todo;
  style?: StyleProp<ViewStyle>;
}

interface TodoItemProps {
  item: Todo;
  onCompletePress: (todo: Todo) => void;
  onDeletePress: (todo: Todo) => void;
}

export const TodoItem = ({
  item,
  onCompletePress,
  onDeletePress,
}: TodoItemProps) => (
  <Swipeable
    containerStyle={{ marginVertical: 4 }}
    renderLeftActions={(a1, a2) => (
      <RenderLeftActions
        onPress={() => {
          onCompletePress(item);
        }}
        item={item}
      />
    )}
    renderRightActions={(a1, a2) => (
      <RenderRightActions
        onPress={() => {
          onDeletePress(item);
        }}
      />
    )}
    overshootLeft={false}
  >
    <Card>
      <Card.Content>
        <View style={{ flexDirection: "row" }}>
          {isWeb && (
            <RenderLeftActions
              onPress={() => {
                onCompletePress(item);
              }}
              item={item}
              style={{ marginEnd: 30 }}
            />
          )}
          <View style={{ flexDirection: "column" }}>
            <Title
              style={{
                textDecorationLine: item.iscomplete ? "line-through" : "none",
              }}
            >
              {item.text}
            </Title>
          </View>
          {isWeb && (
            <RenderRightActions
              onPress={() => onDeletePress(item)}
              style={{ position: "absolute", right: 0, height: "100%" }}
            />
          )}
        </View>
      </Card.Content>
    </Card>
  </Swipeable>
);

const RenderLeftActions = ({ onPress, item, style }: ActionsProps) => {
  const { colors } = useTheme();
  return (
    <Button
      style={[
        {
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.accent,
        },
        style,
      ]}
      icon={item?.iscomplete ? "undo-variant" : "check-bold"}
      onPress={onPress}
      labelStyle={{ color: colors.text }}
    >
      {item?.iscomplete ? "UnCheck" : "Check"}
    </Button>
  );
};

const RenderRightActions = ({ onPress, style }: ActionsProps) => {
  const { colors } = useTheme();
  return (
    <Button
      style={[
        {
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.error,
        },
        style,
      ]}
      labelStyle={{ color: colors.surface }}
      icon="delete"
      onPress={onPress}
    >
      Delete
    </Button>
  );
};
