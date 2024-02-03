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
  Card,
} from "@ui-kitten/components";
import { signOut } from "firebase/auth";
import { auth, db } from "../../configs/firebase";
import Screen from "../../components/Screen";
import { AuthContext } from "../../provider/AuthProvider";
import { StatusBar } from "expo-status-bar";

export default function Home({ navigation }) {
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { uid } = React.useContext(AuthContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

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
              <View
                style={{
                  alignItems: "flex-end",
                }}
              ></View>
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    </Layout>
  );
  const renderHeader = () => (
    <>
      <Divider />
    </>
  );

  return (
    <Screen
      backAction={() => {
        navigation.goBack();
      }}
      headerTitle={"Application"}
    >
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
