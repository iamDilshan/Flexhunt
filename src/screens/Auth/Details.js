import React, { useState } from "react";
import { ScrollView, Image, TouchableOpacity } from "react-native";
import { Button, Layout, Icon, Input, Datepicker } from "@ui-kitten/components";
import Screen from "../../components/Screen";
import * as ImagePicker from "expo-image-picker";

import defProfilePic from "../../../assets/images/Avatar.png";
export default function ({ navigation, route }) {
  const [name, setName] = useState("");
  const [nickName, setNickName] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState(defProfilePic);
  const [gender, setGender] = useState("");

  const { type } = route.params;

  let openImagePickerAsync = async () => {
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

    if (!pickerResult.canceled) {
      setProfilePicture(pickerResult.assets[0].uri);
    }
  };

  const NextIcon = (props) => (
    <Icon {...props} name="arrow-ios-forward-outline" />
  );
  const CalendarIcon = (props) => <Icon {...props} name="calendar-outline" />;

  return (
    <Screen
      backAction={() => {
        navigation.goBack();
      }}
      headerTitle={"Select Job Type"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <Layout
          style={{
            flex: 1,
            justifyContent: "top",
            alignItems: "left",
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
            placeholder="Your Full Name"
            onChangeText={(nextValue) => setName(nextValue)}
          />
          <Input
            style={{ marginHorizontal: "9%", marginVertical: "2%" }}
            size="large"
            status="success"
            value={nickName}
            placeholder="Your Nick Name"
            onChangeText={(nextValue) => setNickName(nextValue)}
          />
          <Datepicker
            min={new Date(1979, 0, 1)}
            style={{ marginHorizontal: "9%", marginVertical: "2%" }}
            size="large"
            status="success"
            date={dob}
            placeholder="Date of Birth"
            accessoryRight={CalendarIcon}
            onSelect={(nextValue) => setDob(nextValue)}
          />
          <Input
            style={{ marginHorizontal: "9%", marginVertical: "2%" }}
            size="large"
            status="success"
            value={gender}
            autoCapitalize="words"
            placeholder="Male / Female"
            onChangeText={(nextValue) => setGender(nextValue)}
          />
          <Input
            style={{ marginHorizontal: "9%", marginVertical: "2%" }}
            size="large"
            status="success"
            value={phoneNumber}
            keyboardType="decimal-pad"
            maxLength={10}
            placeholder="Your Phone Number"
            onChangeText={(nextValue) => setPhoneNumber(nextValue)}
          />
          <Button
            size="large"
            status="success"
            style={{
              marginTop: 36,
              marginHorizontal: 50,
            }}
            accessoryRight={NextIcon}
            onPress={() => {
              navigation.navigate("SelectCity", {
                name,
                nickName,
                dob: dob.toString(),
                gender,
                phoneNumber,
                type,
                profilePicture,
              });
            }}
            disabled={!name || !dob || !gender || !phoneNumber}
          >
            Next
          </Button>
        </Layout>
      </ScrollView>
    </Screen>
  );
}
