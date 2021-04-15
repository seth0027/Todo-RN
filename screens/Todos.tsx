import React from "react";
import { Appearance, useColorScheme } from "react-native-appearance";
import { DefaultTheme, Provider, DarkTheme } from "react-native-paper";
import App from "../App";
import { TodosProvider } from "../TodosContext";

// const theme = {
//   ...DefaultTheme,
//   roundness: 2,
//   colors: {
//     ...DefaultTheme.colors,
//     primary: "#73c9ff",
//     accent: "#fff653",
//   },
// };
// const darkTheme = {
//   ...theme,
//   colors: {
//     ...theme.colors,
//     primary: "#006aa9",
//     accent: "#ba9400",
//   },
// };
export const Todos = () => {
  // const [isDark, setDark] = React.useState(false);
  // const [appTheme, setAppTheme] = React.useState(theme);
  // React.useEffect(() => {
  //   setDark(Appearance.getColorScheme() === "dark");
  //   const subscription = Appearance.addChangeListener(({ colorScheme }) => {
  //     setDark(colorScheme === "dark");
  //   });
  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);
  // React.useEffect(() => {
  //   setAppTheme(isDark ? darkTheme : theme);
  // }, [isDark]);

  return (
    <TodosProvider>
      <Provider>
        <App />
      </Provider>
    </TodosProvider>
  );
};
