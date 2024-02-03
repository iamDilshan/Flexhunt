import React, { useState } from "react";
import {
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import { Button, Layout, Text, Icon, Input } from "@ui-kitten/components";
import Screen from "../../components/Screen";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { auth, db } from "../../configs/firebase";

export default function ({ navigation, route }) {
  const {
    name,
    nickName,
    dob,
    gender,
    phoneNumber,
    type,
    city,
    expertise,
    profilePicture,
  } = route.params;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleInputChange = (setter) => (value) => setter(value);

  const onRegisterPress = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const authUser = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      const user = authUser.user;
      const userData = {
        name: name,
        type: type,
        email: email,
        city: city,
        nickName: nickName,
        dob: dob,
        gender: gender,
        phoneNumber: phoneNumber,
        password: password,
        profilePicture: profilePicture,
        userid: user.uid,
        expertise: expertise,
      };

      let collectionName;
      switch (type) {
        case 1:
          collectionName = "clients";
          break;
        case 0:
          collectionName = "employees";
          break;
      }

      await db.collection(collectionName).doc(user.uid).set(userData);
      console.log(user);
      // navigation.navigate("Login");
    } catch (e) {
      handleFirebaseError(e);
    }
  };

  const handleFirebaseError = (error) => {
    let errorMessage = "An unexpected error occurred. Please try again.";
    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage =
          "This email is already in use. Please use a different email.";
        break;
      case "auth/invalid-email":
        errorMessage = "The email address is not valid.";
        break;
      case "auth/weak-password":
        errorMessage = "The password is too weak.";
        break;
      default:
        console.log(error);
    }
  };

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? "eye-off" : "eye"} />
    </TouchableWithoutFeedback>
  );

  return (
    <Screen
      backAction={() => navigation.goBack()}
      headerTitle="Select Your Expertise"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Layout style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require("../../../assets/images/1.png")}
          />
        </Layout>
        <Layout style={styles.formContainer}>
          <Text style={styles.headerText} category="h5">
            Complete Registration
          </Text>
          <Input
            style={styles.input}
            size="large"
            status="success"
            value={email}
            placeholder="Your Email"
            onChangeText={handleInputChange(setEmail)}
            autoCapitalize="none"
          />
          <Input
            style={styles.input}
            size="large"
            status="success"
            value={password}
            placeholder="Create Your Password"
            accessoryRight={renderIcon}
            secureTextEntry={secureTextEntry}
            onChangeText={handleInputChange(setPassword)}
          />
          <Input
            style={styles.input}
            size="large"
            status="success"
            value={confirmPassword}
            placeholder="Confirm Your Password"
            accessoryRight={renderIcon}
            secureTextEntry={secureTextEntry}
            onChangeText={handleInputChange(setConfirmPassword)}
          />
          <Button
            size="large"
            status="success"
            style={styles.button}
            disabled={loading}
            onPress={onRegisterPress}
          >
            {loading ? "Loading" : "Complete Registration"}
          </Button>
        </Layout>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 200,
    width: 190,
  },
  formContainer: {
    flex: 3,
    paddingHorizontal: 20,
    marginVertical: 2,
    paddingBottom: 20,
  },
  headerText: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    marginHorizontal: "2%",
    marginVertical: "2%",
  },
  button: {
    marginTop: 15,
    marginHorizontal: 10,
  },
});
