import React, { useState, useContext } from "react";
import { ScrollView, Image, TouchableOpacity } from "react-native";
import { Button, Layout, Icon, Input } from "@ui-kitten/components";
import Screen from "../../components/Screen";
import * as ImagePicker from "expo-image-picker";
import defProfilePic from "../../../assets/images/Avatar.png";
import { db } from "../../configs/firebase";
import { AuthContext } from "../../provider/AuthProvider";

export default function ProfileClient({ navigation }) {
  const [name, setName] = useState("");
  const [nickName, setNickName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState(defProfilePic);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { uid } = useContext(AuthContext);

  const openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required.");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // Use "canceled" instead of "cancelled", and access the selected image through the "assets" array
    if (!pickerResult.canceled) {
      const selectedImage = pickerResult.assets[0]; // Access the first selected asset
      setProfilePicture(selectedImage.uri); // Use the "uri" of the first asset
    }
  };
  const NextIcon = (props) => (
    <Icon {...props} name="arrow-ios-forward-outline" />
  );
  const type = 1;
  const EditProfile = async () => {
    const userData = {
      name,
      email,
      nickName,
      phoneNumber,
      password,
      profilePicture,
      type,
    };

    try {
      await db.collection("employees").doc(uid).set(userData);
      console.log("Profile updated:", uid);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Screen backAction={() => navigation.goBack()} headerTitle="Edit Profile">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Layout
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginVertical: "15%",
          }}
        >
          <TouchableOpacity
            onPress={openImagePickerAsync}
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={
                typeof profilePicture === "string"
                  ? { uri: profilePicture }
                  : profilePicture
              }
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                marginBottom: 14,
              }}
            />
          </TouchableOpacity>
          <Input
            style={{ marginHorizontal: "9%", marginVertical: "2%" }}
            size="large"
            status="success"
            value={name}
            placeholder="Company Full Name"
            onChangeText={setName}
          />
          <Input
            style={{ marginHorizontal: "9%", marginVertical: "2%" }}
            size="large"
            status="success"
            value={nickName}
            placeholder="Organization Name"
            onChangeText={setNickName}
          />
          <Input
            style={{ marginHorizontal: "9%", marginVertical: "2%" }}
            size="large"
            status="success"
            value={email}
            autoCapitalize="none"
            placeholder="Email"
            onChangeText={setEmail}
          />
          <Input
            style={{ marginHorizontal: "9%", marginVertical: "2%" }}
            size="large"
            status="success"
            value={password}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={setPassword}
          />
          <Input
            style={{ marginHorizontal: "9%", marginVertical: "2%" }}
            size="large"
            status="success"
            value={phoneNumber}
            keyboardType="phone-pad"
            maxLength={10}
            placeholder="Company Phone Number"
            onChangeText={setPhoneNumber}
          />
          <Button
            size="large"
            status="success"
            style={{ marginTop: 36, marginHorizontal: 50 }}
            accessoryRight={NextIcon}
            onPress={EditProfile}
            disabled={
              !name ||
              !email ||
              !nickName ||
              !phoneNumber ||
              !password ||
              !name ||
              !phoneNumber
            }
          >
            Update Profile
          </Button>
        </Layout>
      </ScrollView>
    </Screen>
  );
}
