import React, { useState } from "react";
import { ScrollView, Image } from "react-native";
import { Button, Layout, Text, Input } from "@ui-kitten/components";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import Screen from "../../components/Screen";
import { auth } from "../../configs/firebase";

export default function ({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function reset() {
    setLoading(true);
    await auth
      .sendPasswordResetEmail(email)
      .then(function () {
        setLoading(false);
        navigation.navigate("Login");
        alert("Your password reset link has been sent to your email");
      })
      .catch(function (error) {
        setLoading(false);
        alert(error.message);
      });
  }

  return (
    <Screen
      backAction={() => {
        navigation.goBack();
      }}
      headerTitle={"Sign In"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <Layout
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            resizeMode="contain"
            style={{}}
            source={require("../../../assets/images/forgot.png")}
          />
        </Layout>
        <Layout
          style={{
            flex: 3,
            paddingHorizontal: 20,
            paddingBottom: 20,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: 10,
            }}
            category="h5"
          >
            Forgot Password
          </Text>
          <Text
            size="md"
            style={{
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            Select which contact details should we use to reset your password
          </Text>
          <Input
            style={{ marginHorizontal: "2%", marginVertical: "1%" }}
            size="large"
            status="success"
            value={email}
            label="Email"
            placeholder="Your Email"
            onChangeText={(nextValue) => setEmail(nextValue)}
          />
          <Button
            size="large"
            style={{
              marginTop: 20,
              marginHorizontal: 10,
            }}
            disabled={loading}
            status="success"
            onPress={() => {
              reset();
            }}
          >
            {loading ? "Loading" : "Send email"}
          </Button>

          <Layout
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 15,
              justifyContent: "center",
            }}
          ></Layout>
        </Layout>
      </ScrollView>
    </Screen>
  );
}
