import React, { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  ImageBackground,
  Image,
  TextInput,
  View,
  StyleSheet,
  TouchableNativeFeedback,
  RefreshControl,
  ScrollView,
} from "react-native";
import {
  Divider,
  Layout,
  Text,
  Button,
  Icon,
  Modal,
  Card,
} from "@ui-kitten/components";
import { signOut } from "firebase/auth";
import { auth, db } from "../../configs/firebase";
import Screen from "../../components/Screen";
import { AuthContext } from "../../provider/AuthProvider";
import { StatusBar } from "expo-status-bar";

const Header = ({ profileImageUrl }) => {
  const { uid } = React.useContext(AuthContext);
  const [nickName, setNickName] = useState("");

  useEffect(() => {
    if (!uid) return;

    const unsubscribe = db
      .collection("employees")
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
    <Layout
      style={{
        padding: 1,
        paddingHorizontal: 3,
      }}
    >
      <Screen>
        <View style={styles.header}>
          <Image
            source={{ uri: profileImageUrl }}
            style={styles.profileImage}
          />
          <View
            style={{
              marginLeft: 30,
              height: 30,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: "bold",
              }}
            >
              Good Morning
            </Text>
            <Text
              style={{
                fontSize: 19,
                fontWeight: "bold",
              }}
            >
              {nickName}
            </Text>
          </View>
          <Button
            style={{
              marginTop: 10,
              marginLeft: "36%",
              alignContent: "center",
            }}
            size="tiny"
            appearance="outline"
            status="success"
            onPress={handleLogout}
          >
            Logout
          </Button>
        </View>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <TouchableNativeFeedback>
            <ImageBackground
              source={require("../../../assets/images/CardCli.png")}
              style={styles.cardImage}
            />
          </TouchableNativeFeedback>
        </View>
        <Text style={styles.recommendationTitle}>Posted Jobs</Text>
      </Screen>
    </Layout>
  );
};

export default function Home({ navigation }) {
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { uid } = React.useContext(AuthContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchProfileImage();
    fetchRecommendations();
  }, []);

  const fetchProfileImage = async () => {
    const imageUrl =
      "https://assets-global.website-files.com/650865454c2393ac25711ff7/650865454c2393ac25714a3e_The%20best%20selfie%20Ideas%20for%20sm%20pfp.jpeg"; // Replace with actual image URL
    setProfileImageUrl(imageUrl);
  };

  const fetchRecommendations = async () => {
    setLoading(true); // Start loading
    try {
      const querySnapshot = await db.collection("JobPost").get();
      const recommendationsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRecommendations(recommendationsData);
    } catch (e) {
      console.error("Error fetching posts:", e);
    }
    setLoading(false);
  };
  // console.log(recommendations);

  const handleAddToWishlist = async (id, user) => {
    try {
      await db.collection("savedJobs").doc(id).set({ id, user, uid });
      console.log("Job added successfully");
    } catch (error) {
      console.error("Error added document:", error);
    }
  };

  const handleModal = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <Layout
      style={{
        paddingHorizontal: 28,
        paddingBottom: 10,
      }}
    >
      <TouchableNativeFeedback onPress={() => handleModal(item)}>
        <View style={styles.recommendationItem}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text
                category="h6"
                style={{
                  fontWeight: "bold",
                }}
              >
                {item.jobTitle}
              </Text>
              <Text
                category="p2"
                style={{
                  fontWeight: "500",
                  marginBottom: 5,
                }}
              >
                {item.cliName}
              </Text>
            </View>
          </View>
          <Divider />
          <Text category="c1">{item.duration} Hours </Text>
          <Text category="c1">{item.location}</Text>
          <Text category="c1">{item.city}</Text>
          <Text
            category="p2"
            style={{
              fontWeight: "bold",
              color: "#2CCFA1",
            }}
          >
            Rs:{item.salary} /= (Per Day)
          </Text>
          <View
            style={{
              alignItems: "flex-start",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "stretch",
                justifyContent: "fle",
              }}
            >
              <Button
                size="tiny"
                style={{
                  marginHorizontal: 5,
                  padding: 3,
                  marginVertical: 4,
                }}
                status={"success"}
                appearance="outline"
              >
                {item.employmentType}
              </Button>
              <View
                style={{
                  alignItems: "flex-end",
                }}
              >
                <Button
                  size="tiny"
                  style={{
                    marginHorizontal: 5,
                    marginLeft: "60%",
                    alignItems: "flex-end",
                    padding: 3,
                    marginVertical: 4,
                  }}
                  accessoryLeft={(props) => (
                    <Icon {...props} name="bookmark-outline" />
                  )}
                  status="warning"
                  appearance="outline"
                  onPress={() => handleAddToWishlist(item.id, item.user)}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    </Layout>
  );
  const renderHeader = () => (
    <>
      <Header profileImageUrl={profileImageUrl} />
      <Divider />
    </>
  );

  return (
    <Screen>
      <Layout>
        <FlatList
          data={recommendations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchRecommendations}
            />
          }
          contentContainerStyle={styles.listContainer}
        />
      </Layout>
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
        animationType="fade"
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
                    status="danger"
                    style={{
                      marginHorizontal: 10,
                      padding: 3,
                      marginVertical: 4,
                    }}
                  >
                    Apply
                  </Button>
                  <Button
                    size="small"
                    accessoryLeft={(props) => (
                      <Icon {...props} name="navigation-2-outline" />
                    )}
                    status="success"
                    appearance="filled"
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </Card>
      </Modal>
      {/* <StatusBar animated={true} hidden={true} /> */}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: 46,
    height: 46,
    borderRadius: 23,
    marginBottom: 5,
  },
  searchBar: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: "darkgray",
    borderRadius: 5,
    padding: 5,
    margin: 10,
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
  recommendationItem: {
    marginTop: 10,
    padding: 19,
    paddingHorizontal: 15,
    paddingBottom: 10,
    padding: 10,
    paddingBottom: 5,
    borderWidth: 2,
    borderRadius: 9,
    borderColor: "gray",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
});
