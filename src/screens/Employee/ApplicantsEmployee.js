import React, { useState, useEffect } from "react";
import {
  FlatList,
  ImageBackground,
  View,
  StyleSheet,
  ScrollView,
  TouchableNativeFeedback,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import {
  Divider,
  Layout,
  Text,
  Button,
  Avatar,
  Modal,
  Card,
  Icon,
} from "@ui-kitten/components";
import { signOut } from "firebase/auth";
import { auth, db } from "../../configs/firebase";
import Screen from "../../components/Screen";
import { AuthContext } from "../../provider/AuthProvider";
import ApplicantCard from "../../components/ApplicantCard";

const Header = () => {
  return (
    <Screen>
      <Layout style={styles.headerLayout}>
        <Text
          style={{
            marginLeft: "5%",
            fontWeight: "bold",
            marginBottom: "3%",
          }}
          category="h6"
        >
          Your job applicants
        </Text>
        <Divider />
      </Layout>
    </Screen>
  );
};

export default function HomeScreen({ navigation }) {
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const { uid } = React.useContext(AuthContext);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const querySnapshot = await db
        .collection("JobPost")
        .where("user", "==", uid)
        .get();
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecommendations(postsData);

      let dataArray = postsData;

      dataArray.forEach(async (item) => {
        let employeeArray = item.employee;
        let empIds = employeeArray.map((employee) => employee.emp_id);

        // Fetch the details of each employee
        const employeeDetailsPromises = empIds.map((empId) =>
          db.collection("Employee").doc(empId).get()
        );

        const employeeDetailsSnapshots = await Promise.all(
          employeeDetailsPromises
        );

        // Map over the snapshots to get the employee data
        const employeeDetails = employeeDetailsSnapshots.map((snapshot) => ({
          id: snapshot.id,
          ...snapshot.data(),
        }));

        console.log(employeeDetails);
      });
    } catch (error) {
      console.error("Error getting documents:", error);
    }
    setLoading(false);
  };

  const renderItem = ({ item }) => {
    const postedDate = item.postedTime.toDate();
    const formattedDate = `${postedDate.getFullYear()}/${
      postedDate.getMonth() + 1
    }/${postedDate.getDate()} ${postedDate.getHours()}:${postedDate.getMinutes()}`;
    return (
      <Layout style={styles.ApplicantflexLayout}>
        <TouchableNativeFeedback onPress={() => handleModal(item)}>
          <View style={styles.Applicantflex}>
            <Text
              style={{
                backgroundColor: "#2CCFA1",
                padding: 1,
                paddingHorizontal: 9,
                color: "#FFF",
              }}
              category="c2"
            >
              Applicants
            </Text>
            <Text category="h6" style={styles.jobTitle}>
              {item.jobTitle}
            </Text>
            <Text category="c1">Posted Date: {formattedDate}</Text>
            <View>
              <Divider
                style={{
                  marginBottom: "2%",
                }}
              />
              <View
                style={{
                  marginVertical: "2%",
                  alignItems: "flex-end",
                }}
              >
                <Button
                  size="tiny"
                  status="success"
                  onPress={() => deletePost(item.id)}
                  accessoryLeft={(props) => (
                    <Icon {...props} name="checkmark-outline" />
                  )}
                >
                  Accept
                </Button>
                <Button
                  size="tiny"
                  status="danger"
                  onPress={() => deletePost(item.id)}
                  accessoryLeft={(props) => (
                    <Icon {...props} name="slash-outline" />
                  )}
                >
                  Reject
                </Button>
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
      </Layout>
    );
  };
  return (
    <Screen
      backAction={() => {
        navigation.goBack();
      }}
      headerTitle={"Applicants"}
    >
      <FlatList
        data={filter.length > 0 ? filter : recommendations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <>
            <Header />
          </>
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchApplicants} />
        }
        contentContainerStyle={styles.listContainer}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  // ... existing styles
  headerLayout: {
    padding: 1,
    paddingHorizontal: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 5,
    paddingLeft: 15,
    paddingTop: 15,
  },
  profileImage: {
    marginTop: 3,
    width: 60,
    padding: 2,
    height: 60,
    borderRadius: 23,
  },
  headerTextContainer: {
    marginLeft: 30,
    height: 30,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  headerNickName: {
    fontSize: 19,
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: 10,
    marginLeft: "36%",
    alignContent: "center",
  },
  cardContainer: {
    alignItems: "center",
  },
  cardImage: {
    width: 360,
    height: 160,
    resizeMode: "cover",
  },
  recommendationTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 6,
    marginTop: 9,
  },

  ApplicantflexLayout: {
    marginHorizontal: 20,
    paddingVertical: 15,
    height: 210,
    margin: 7,
    paddingBottom: 1,
  },
  Applicantflex: {
    paddingHorizontal: 15,
    paddingBottom: 10,
    padding: 6,
    borderWidth: 2,
    borderRadius: 9,
    borderColor: "gray",
    alignItems: "stretch",
  },
  jobTitle: {
    fontWeight: "bold",
  },
  detailsButton: {
    marginHorizontal: 90,
  },
  salaryText: {
    fontWeight: "bold",
    color: "#2CCFA1",
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  applicantsButton: {
    borderRadius: 25,
    marginBottom: 3,
  },
  deleteButton: {
    padding: 10,
  },
  listContainer: {
    paddingBottom: 5,
  },
  // Add any additional styles you need here
});
