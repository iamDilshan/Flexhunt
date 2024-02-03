import React, { useState, useEffect, useContext } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  TouchableNativeFeedback,
  RefreshControl,
} from "react-native";
import { Divider, Layout, Text, Button, Icon } from "@ui-kitten/components";
import Screen from "../../components/Screen";
import { db } from "../../configs/firebase";
import { AuthContext } from "../../provider/AuthProvider";

export default function SavedJobsClient({ navigation }) {
  const [savedJobList, setSavedJobList] = useState([]);
  const { uid } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  // const [jobPostIds, setjobPostIds] = useState();

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      // Fetch the saved job references for the current user
      const savedJobsSnapshot = await db
        .collection("savedJobs")
        .where("uid", "==", uid)
        .get();

      // Extract the job post IDs from the saved job references
      const jobPostIds = savedJobsSnapshot.docs.map((doc) => doc.data().id);

      // Fetch the full job post details for each saved job

      const jobPostsPromises = jobPostIds.map((jobPostId) =>
        db.collection("JobPost").doc(jobPostId).get()
      );

      const jobPostsSnapshots = await Promise.all(jobPostsPromises);

      // Map over the snapshots to get the job post data
      const jobPosts = jobPostsSnapshots.map((snapshot) => ({
        id: snapshot.id,
        ...snapshot.data(),
      }));

      // Update the state with the fetched job posts
      setSavedJobList(jobPosts);

      console.log(jobPosts);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    }
    setLoading(false);
  }

  const getSaveJobData = async () => {
    try {
      console.log(jobPostIds);
      const savedJobsSnapshotData = await db
        .collection("jobPosts")
        .where("id", "==", jobPostIds)
        .get();
    } catch (error) {
      console.error("Error deleted document:", error);
    }
  };

  const handleRemoveToWishlist = async (id, user) => {
    try {
      await db.collection("savedJobs").doc(id).delete({ id, user, uid });
      console.log("Job deleted successfully");
    } catch (error) {
      console.error("Error deleted document:", error);
    }
  };

  const renderItem = ({ item }) => (
    <Layout style={styles.container}>
      <TouchableNativeFeedback onPress={() => console.log("Pressed item")}>
        <View style={styles.savedPost}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              category="h5"
              style={{
                fontWeight: "bold",
              }}
            >
              {item.jobTitle}
            </Text>
            <Button
              appearance="ghost"
              accessoryLeft={(props) => (
                <Icon {...props} name="bookmark-outline" />
              )}
              onPress={() => handleRemoveToWishlist(item.id, item.user)}
            />
          </View>
          <Divider />
          <Text>{item.duration} Hours </Text>
          <Text>{item.location}</Text>
          <Text>{item.city}</Text>
          <Text
            category="p2"
            style={{
              fontWeight: "bold",
              color: "#2CCFA1",
            }}
          >
            Rs:{item.salary} /= (Per Day)
          </Text>
        </View>
      </TouchableNativeFeedback>
    </Layout>
  );

  return (
    <Screen backAction={() => navigation.goBack()} headerTitle="Saved job">
      <Layout>
        <FlatList
          data={savedJobList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchPosts} />
          }
          contentContainerStyle={styles.listContainer}
        />
      </Layout>
    </Screen>
  );
}
const styles = StyleSheet.create({
  container: {
    margin: 10,
    marginBottom: 2,
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
  savedPost: {
    marginTop: 10,
    padding: 19,
    paddingHorizontal: 15,
    paddingBottom: 10,
    paddingVertical: 15,
    borderWidth: 2,
    borderRadius: 9,
    borderColor: "gray",
  },
  listContainer: {
    paddingBottom: 20,
  },
});
