import "react-native-gesture-handler";
import React, { useState } from "react";
import { default as colors } from "./src/configs/Colors.json";
import AppNavigation from "./src/navigation/AppNavigation";
import { LogBox } from "react-native";
import { AuthProvider } from "./src/provider/AuthProvider";
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { ThemeContext } from "./src/configs/Theme";
import { StatusBar } from "expo-status-bar";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";

export default function App() {
  React.useEffect(() => {
    LogBox.ignoreLogs([
      "AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage",
    ]);
  }, []);

  const [theme, setTheme] = useState("light");

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ThemeContext.Provider value={{ theme }}>
        <ApplicationProvider {...eva} theme={eva.light}>
          <AuthProvider>
            <AppNavigation />
          </AuthProvider>
        </ApplicationProvider>
      </ThemeContext.Provider>
    </>
  );
}
