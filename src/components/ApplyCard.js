import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Avatar,
  Card,
  Divider,
  Text,
  Button,
  ButtonGroup,
} from "@ui-kitten/components";

const ApplyCard = ({ Jobtitle, Location, City, Salary, Duration, emptype }) => {
  return (
    <Card style={styles.Cardinfo}>
      <View>
        <View style={styles.flextype}>
          <View>
            <Text category="h4">{item.Jobtitle}</Text>
            <Text category="p1">Company Name</Text>
          </View>
        </View>
        <View style={{ marginHorizontal: "1%" }}>
          <Divider />
          <Text style={{ marginBottom: 2 }} category="p1">
            {Location}
          </Text>
          <Text style={{ marginBottom: 2 }} category="p1">
            {City}
          </Text>
          <Text
            style={{ color: "#2CCFA1", fontWeight: "bold", marginBottom: 2 }}
            category="p1"
          >
            Rs: {Salary}/= (Per Day)
          </Text>
          <Text category="p2" style={{ paddingVertical: 2, marginBottom: 5 }}>
            {Duration} Hours
          </Text>
          <Button
            style={{ marginHorizontal: 19, justifyContent: "center" }}
            status={emptype === "Full time" ? "success" : "danger"}
            appearance="outline"
          >
            {emptype}
          </Button>
        </View>
      </View>
    </Card>
  );
};

export default ApplyCard;

const styles = StyleSheet.create({
  Cardinfo: {
    flexDirection: "row",
    marginHorizontal: 10,
  },
  avatar: {
    padding: 32,
    width: 50,
    height: 50,
    marginRight: 15,
    marginLeft: 1,
  },
  flextype: {
    paddingVertical: 10,
    alignItems: "left",
    justifyContent: "left",
    flexDirection: "row",
  },
});
