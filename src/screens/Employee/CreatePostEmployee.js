import React, { useState, useContext } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableNativeFeedback,
  View,
  FlatList,
  ImageBackground,
} from "react-native";
import {
  Button,
  Layout,
  Text,
  Input,
  Select,
  IndexPath,
  SelectItem,
  Divider,
} from "@ui-kitten/components";
import Screen from "../../components/Screen";
import Newcard from "../../components/NewCard";
import jobTitle from "../../configs/jobTitle.json";
import cityData from "../../configs/cityData.json";
import { auth, db } from "../../configs/firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { AuthContext } from "../../provider/AuthProvider";

export default function ({ navigation }) {
  const [profilePicture, SetProfilePicture] = useState(null);
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [salary, setSalary] = useState("");
  const [employmentType, setEmploymentType] = useState("Part-Time");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [selectedCityIndex, setSelectedCityIndex] = useState(new IndexPath(0));
  const { uid } = React.useContext(AuthContext);

  const displayValue = jobTitle[selectedIndex.row];
  const displayCityValue = cityData[selectedCityIndex.row].city;

  const toggleEmploymentType = () => {
    setEmploymentType(
      employmentType === "Part-Time" ? "Full-Time" : "Part-Time"
    );
  };

  const publishPost = async () => {
    try {
      // Fetch the client's username from the 'clients' collection
      const docSnapshot = await db.collection("clients").doc(uid).get();
      let userName = "";
      if (docSnapshot.exists) {
        userName = docSnapshot.data().nickName;
      }

      const publishData = {
        jobTitle: displayValue,
        city: displayCityValue,
        location: location,
        salary: salary,
        employmentType: employmentType,
        duration: duration,
        description: description,
        cliName: userName,
        user: uid,
        employee: [
          {
            emp_id: "",
            is_selected: true,
            status: 0,
          },
        ],
        postedTime: firebase.firestore.Timestamp.now(),
      };

      // Add the new job post to the 'JobPost' collection
      const documentReference = await db.collection("JobPost").add(publishData);
      const jobId = documentReference.id; // This is the unique ID of the saved job post

      // Update the document with the job ID
      await documentReference.update({ id: jobId });

      console.log("Post published successfully with ID:", jobId);
      alert("Post published successfully");

      // Reset the state variables
      setLocation("");
      setCity("");
      setSalary("");
      setDuration("");
      setDescription("");
    } catch (e) {
      console.error("Error publishing post:", e);
    }
  };

  return (
    <Screen
      backAction={() => {
        navigation.goBack();
      }}
      headerTitle="Create Post"
    >
      <ScrollView>
        <Divider />
        <Layout style={styles.container}>
          <Text
            style={{
              fontWeight: "bold",
              marginBottom: 20,
              alignItems: "center",
            }}
            category="h6"
          >
            Create Your Post
          </Text>

          <Layout style={styles.formContainer}>
            <View
              style={{
                flexDirection: "column",
                marginHorizontal: "5",
                alignItems: "left",
              }}
            >
              <Select
                label={"Job Title"}
                value={selectedJobTitle}
                style={styles.select}
                selectedIndex={selectedIndex}
                onSelect={(index) => {
                  setSelectedIndex(index);
                  setSelectedJobTitle(jobTitle[index.row]);
                }}
              >
                {jobTitle.map((title, index) => (
                  <SelectItem key={index} title={title} />
                ))}
              </Select>
              <Select
                style={{
                  width: "100%",
                }}
                label="City"
                selectedIndex={selectedCityIndex}
                value={displayCityValue}
                onSelect={(index) => setSelectedCityIndex(index)}
              >
                {cityData.map((item, index) => (
                  <SelectItem key={index} title={item.city} />
                ))}
              </Select>
              <Input
                status="success"
                label="Location"
                value={location}
                onChangeText={setLocation}
                placeholder="Location"
              />
              <Input
                status="success"
                label="Salary"
                value={salary}
                onChangeText={setSalary}
                placeholder="Salary"
              />
              <Input
                status="success"
                value={duration}
                label="Duration"
                onChangeText={setDuration}
                placeholder="Duration in Hours"
              />
              <Input
                status="success"
                value={description}
                label="Description"
                onChangeText={setDescription}
                placeholder="Description"
              />
              <Button
                style={{
                  marginTop: 10,
                  width: "100%",
                }}
                status="danger"
                appearance="outline"
                onPress={toggleEmploymentType}
              >
                {employmentType}
              </Button>
              <Button
                style={styles.publishButton}
                appearance="outline"
                status="success"
                onPress={publishPost}
                disabled={
                  !selectedJobTitle ||
                  !displayCityValue ||
                  !location ||
                  !salary ||
                  !duration ||
                  !description ||
                  !employmentType
                }
              >
                Publish
              </Button>
            </View>
          </Layout>
          <View>
            <Text
              style={{
                fontWeight: "bold",
                marginBottom: 20,
                marginTop: 15,
                alignItems: "center",
              }}
              category="h6"
            >
              How it looks
            </Text>
            <Newcard
              avatarUrl={
                "https://img.freepik.com/premium-vector/avatar-icon002_750950-52.jpg"
              }
              Jobtitle={displayValue}
              Location={location}
              City={displayCityValue}
              Salary={salary}
              Duration={duration}
              emptype={employmentType}
            />
          </View>
        </Layout>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 19,
    paddingBottom: 20,
    alignItems: "stretch",
    marginHorizontal: 10,
  },
  formContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 15,
  },
  select: {
    width: "100%",
  },
  publishButton: {
    alignItems: "center",
    width: "100%",
    height: 20,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 6,
    justifyContent: "center",
  },
  titleContainer: {
    backgroundColor: "rgba(0,0,0,0.3)", // Add an overlay to the image
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: "100%",
  },
  title: {
    color: "white",
    textAlign: "center",
  },
  card: {
    width: "100%",
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
