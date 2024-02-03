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

const Header = ({ profileImageUrl, handleSearch }) => {
  const { uid } = React.useContext(AuthContext);
  const [nickName, setNickName] = useState("");

  useEffect(() => {
    if (!uid) return;

    const unsubscribe = db
      .collection("clients")
      .doc(uid)
      .onSnapshot((docSnapshot) => {
        if (docSnapshot.exists) {
          const nickNameFromDoc = docSnapshot.data().nickName;
          setNickName(nickNameFromDoc);
        }
      });

    return () => {
      unsubscribe();
    };
  }, [uid]);

  // Logging Out Function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <Layout style={styles.headerLayout}>
      <Screen>
        <View style={styles.header}>
          <Avatar
            source={{ uri: profileImageUrl }}
            style={styles.profileImage}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Good Morning</Text>
            <Text style={styles.headerNickName}>{nickName}</Text>
          </View>
          <Button
            style={styles.logoutButton}
            size="tiny"
            appearance="outline"
            status="success"
            onPress={handleLogout}
          >
            Logout
          </Button>
        </View>
        <View style={styles.cardContainer}>
          <TouchableNativeFeedback>
            <ImageBackground
              source={require("../../../assets/images/CardEmp.png")}
              style={styles.cardImage}
            />
          </TouchableNativeFeedback>
        </View>
        <Text style={styles.recommendationTitle}>Your Posted Jobs</Text>
        <Divider />
      </Screen>
    </Layout>
  );
};

export default function HomeScreen({ navigation }) {
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const { uid } = React.useContext(AuthContext);

  useEffect(() => {
    fetchProfileImage();
    fetchRecommendations();
  }, []);

  const fetchProfileImage = async () => {
    const imageUrl =
      "https://img.freepik.com/premium-vector/avatar-icon002_750950-52.jpg";
    setProfileImageUrl(imageUrl);
  };

  const fetchRecommendations = async () => {
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
    } catch (error) {
      console.error("Error getting documents:", error);
    }
    setLoading(false);
  };

  const deletePost = async (id) => {
    try {
      await db.collection("JobPost").doc(id).delete();
      console.log("Document deleted successfully");
      setRecommendations(recommendations.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleModal = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const renderItem = ({ item }) => {
    const postedDate = item.postedTime.toDate();
    const formattedDate = `${postedDate.getFullYear()}/${
      postedDate.getMonth() + 1
    }/${postedDate.getDate()} ${postedDate.getHours()}:${postedDate.getMinutes()}`;
    return (
      <Layout style={styles.recommendationItemLayout}>
        <TouchableNativeFeedback onPress={() => handleModal(item)}>
          <View style={styles.recommendationItem}>
            <Text category="h6" style={styles.jobTitle}>
              {item.jobTitle}
            </Text>
            <Text category="c1">Posted Date: {formattedDate}</Text>
            <Divider />
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Button size="tiny" status="success" appearance="filled">
                Post Details
              </Button>
            </View>
            <Text category="c2">{item.duration} Hours</Text>
            <Text category="c2">{item.location} hours</Text>
            <Text category="c2">{item.city}</Text>
            <Text category="c2" style={styles.salaryText}>
              Rs:{item.salary} /~ (Per Day)
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                size="tiny"
                status="success"
                appearance="filled"
                style={styles.applicantsButton}
              >
                Applicants Details
              </Button>
              <Button
                size="tiny"
                status="danger"
                onPress={() => deletePost(item.id)}
                style={styles.deleteButton}
                accessoryLeft={(props) => <Icon {...props} name="trash-2" />}
              />
            </View>
          </View>
        </TouchableNativeFeedback>
      </Layout>
    );
  };
  return (
    <Screen>
      <FlatList
        data={filter.length > 0 ? filter : recommendations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <>
            <Header
              profileImageUrl={profileImageUrl}
              handleSearch={(text) => setSearchText(text)}
            />
          </>
        )}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchRecommendations}
          />
        }
        contentContainerStyle={styles.listContainer}
      />
      <Modal
        style={{
          alignItems: "center",
          height: "75%",
          width: "100%",
          marginHorizontal: 10,
          marginVertical: 10,

          padding: "5%",
          alignItems: "center",
        }}
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose
        backdropStyle={styles.backdrop}
        onBackdropPress={closeModal}
      >
        <Card disabled={true}>
          <ScrollView>
            <View
              style={{
                padding: 2,
                flex: 1,
                borderRadius: 20,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: "90%",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderRadius: 20,
                  borderColor: "#2CCFA1",
                  padding: 15,
                }}
              >
                <Text category="h5">{selectedItem?.jobTitle}</Text>
                <Text category="p2">{selectedItem?.cliName}</Text>
                <Text category="c1">{selectedItem?.location}</Text>
                <Text category="p1">{selectedItem?.city}</Text>
                <Text
                  category="p2"
                  style={{
                    margin: 3,
                    fontWeight: "bold",
                    marginBottom: 3,
                  }}
                  status="success"
                >
                  Rs: {selectedItem?.salary}/=(Per Day)
                </Text>
                <Button size={"tiny"} category="c2">
                  {selectedItem?.employmentType}
                </Button>
              </View>
              <View>
                <Divider style={{ marginTop: 10 }} />
                <Text
                  category="p1"
                  style={{ marginTop: 12, fontWeight: "bold" }}
                >
                  Job Description
                </Text>
                <Text category="c1" style={{ marginTop: 12 }}>
                  {selectedItem?.description}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 30,
                  }}
                >
                  <Button
                    size="small"
                    accessoryLeft={(props) => (
                      <Icon {...props} name="trash-2-outline" />
                    )}
                    status="danger"
                    appearance="filled"
                  >
                    Delete
                  </Button>
                </View>
              </View>
            </View>
          </ScrollView>
        </Card>
      </Modal>
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
    marginBottom: 20,
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

  recommendationItemLayout: {
    marginHorizontal: 20,
    paddingVertical: 15,
    height: 210,
    margin: 7,
    paddingBottom: 1,
  },
  recommendationItem: {
    paddingHorizontal: 15,
    paddingBottom: 10,
    padding: 6,
    borderWidth: 2,
    borderRadius: 9,
    borderColor: "gray",
    alignItems: "flex-start",
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
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  applicantsButton: {
    borderRadius: 25,
    marginBottom: 3,
  },
  deleteButton: {
    padding: 10,
    marginLeft: "50%",
  },
  listContainer: {
    paddingBottom: 20,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  // Add any additional styles you need here
});
