import React from "react";
import { ActivityIndicator, Image } from "react-native";
import { Layout, useTheme } from "@ui-kitten/components";
import Screen from "../components/Screen";
import { StatusBar } from "expo-status-bar";
export default function ({ navigation }) {
  const theme = useTheme();
  return (
    <Screen>
      <Layout
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Image
          source={require("../../assets/images/loard.png")}
          style={{
            resizeMode: "contain",
            width: 500,
            height: 350,
          }}
        />
        <Image source={require("../../assets/images/1.png")} style={{}} />
        <ActivityIndicator
          size="giant"
          color={theme["color-success-default"]}
        />
      </Layout>
      <StatusBar style="auto" />
    </Screen>
  );
}
