import React, { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import {
  Button,
  Layout,
  Radio,
  RadioGroup,
  Input,
} from "@ui-kitten/components";
import Screen from "../../components/Screen";

export default function ({ navigation, route }) {
  const {
    name,
    nickName,
    dob,
    gender,
    phoneNumber,
    type,
    city,
    profilePicture,
  } = route.params;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const expertises = [
    "Administrative Assistant",
    "App Developer",
    "Babysitter",
    "Bank Teller",
    "Bartender",
    "Bookkeeper",
    "Brand Ambassador",
    "Cleaner",
    "Construction Worker",
    "Copywriter",
    "Customer Service Representative",
    "Data Entry",
    "Delivery Driver",
    "Delivery Rider",
    "Dog Walker",
    "Driver Partner",
    "Email Marketing",
    "Fitness Instructor",
    "Freelancer",
    "Lecturer",
    "Mail carrier",
    "Occupational Therapist",
    "Personal Driver",
    "Personal Shopper",
    "Phlebotomist",
    "Product Packaging",
    "Real Estate Agent",
    "Receptionist",
    "Sales Associate",
    "Security Officer",
    "Social Media Manager",
    "Speech Pathologist",
    "Teacher",
    "Tour Guide",
    "Transcriptionist",
    "Tutor",
    "Typesetter",
    "Warehouse Worker",
  ];

  const filteredExpertises = expertises.filter((expertise) =>
    expertise.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContinue = () => {
    const selectedExpertise = expertises[selectedIndex];
    navigation.navigate("Register", {
      name,
      nickName,
      dob,
      gender,
      phoneNumber,
      type,
      city,
      expertise: selectedExpertise,
      profilePicture,
    });
  };
  console.log(route.params);

  return (
    <Screen
      backAction={() => {
        navigation.goBack();
      }}
      headerTitle={"Select City"}
    >
      <Layout
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "left",
          padding: 20,
        }}
      >
        <Text
          category="h1"
          style={{
            fontWeight: "bold",
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          What is your expertise?
        </Text>
        <Text
          style={{
            textAlign: "center",
          }}
        >
          Please select your field of expertise (Up to 3)
        </Text>
        <Input
          style={{ marginHorizontal: "9%", marginVertical: "2%" }}
          size="large"
          status="success"
          value={searchTerm}
          placeholder="Search"
          onChangeText={setSearchTerm}
        />
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RadioGroup
            selectedIndex={selectedIndex}
            onChange={(index) => setSelectedIndex(index)}
            style={{
              width: "85%",
              alignItems: "left",
            }}
          >
            {filteredExpertises.map((item, index) => (
              <Radio status="success" key={index}>
                {item}
              </Radio>
            ))}
          </RadioGroup>
        </ScrollView>
        <Button
          size="large"
          status="success"
          onPress={handleContinue}
          disabled={selectedIndex === null}
          style={{
            borderRadius: 5,
            marginVertical: 5,
            width: "100%",
            alignSelf: "center",
          }}
        >
          Continue
        </Button>
      </Layout>
    </Screen>
  );
}
