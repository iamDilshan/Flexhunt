import React, { useState, useContext } from "react";
import {
  Button,
  Layout,
  Text,
  Icon,
  Input,
  OverflowMenu,
  MenuItem,
} from "@ui-kitten/components";
import { ScrollView, Image, TouchableWithoutFeedback } from "react-native";
import { auth, db } from "../../configs/firebase";
import Screen from "../../components/Screen";
import { ThemeContext } from "../../configs/Theme";

const toggleSecureEntry = (setSecureTextEntry) => {
  setSecureTextEntry((prevSecureTextEntry) => !prevSecureTextEntry);
};

const toggleMenu = (setMenuVisible) => {
  setMenuVisible((prevMenuVisible) => !prevMenuVisible);
};

export default function ({ navigation }) {
  const themeContext = useContext(ThemeContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  async function login() {
    setLoading(true);
    try {
      await auth.signInWithEmailAndPassword(email, password);
      setEmail("");
      setPassword("");
      // navigation.navigate(type === 1 ? "MainEmps" : "MainClis", { type });
      // navigation.navigate({ type });
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const renderIcon = (props) => (
    <TouchableWithoutFeedback
      onPress={() => toggleSecureEntry(setSecureTextEntry)}
    >
      <Icon {...props} name={secureTextEntry ? "eye-off" : "eye"} />
    </TouchableWithoutFeedback>
  );

  return (
    <Screen>
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
            style={{
              height: 220,
              width: 320,
            }}
            source={require("../../../assets/images/1.png")}
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
            Login to Your Account
          </Text>
          <Input
            style={{ marginHorizontal: "2%", marginVertical: "1%" }}
            size="large"
            status="success"
            value={email}
            label="Email"
            placeholder="Your Email"
            autoComplete="email"
            onChangeText={(nextValue) => setEmail(nextValue)}
            autoCapitalize="none"
          />
          <Input
            style={{ marginHorizontal: "2%", marginVertical: "1%" }}
            size="large"
            status="success"
            value={password}
            label="Password"
            placeholder="Your Password"
            autoComplete="password"
            accessoryRight={renderIcon}
            secureTextEntry={secureTextEntry}
            onChangeText={(nextValue) => setPassword(nextValue)}
          />
          <Button
            size="large"
            status="success"
            style={{
              marginTop: 20,
              marginHorizontal: 10,
            }}
            disabled={loading}
            onPress={() => {
              login();
            }}
          >
            {loading ? "Loading" : "Sign In"}
          </Button>
          <Layout
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 15,
              justifyContent: "center",
            }}
          >
            <Button
              onPress={() => {
                navigation.navigate("Type");
              }}
              appearance="ghost"
              status="success"
            >
              <Text size="md">Don't have an account? </Text>
              Register here
            </Button>
          </Layout>
          <Layout
            style={{
              flexDirection: "column",
              // alignItems: "center",
              // justifyContent: "center",
            }}
          >
            <Button
              onPress={() => {
                navigation.navigate("ForgotPassword");
              }}
              appearance="ghost"
              status="success"
            >
              Forgot password
            </Button>
            <Layout style={{ height: "30%" }}>
              <Button
                // onPress={() => {
                //   navigation.navigate("");
                // }}

                appearance="outline"
                style={{
                  paddingRight: 30,
                  marginHorizontal: "35%",
                }}
                status="success"
              >
                <Icon name="google" />
              </Button>
            </Layout>
          </Layout>
        </Layout>
      </ScrollView>
    </Screen>
  );
}
