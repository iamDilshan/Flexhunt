import React from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Card, Divider, Text, Button } from "@ui-kitten/components";

const ApplicantCard = ({ name, phoneNumber, location }) => {
  return (
    <Card style={styles.Cardinfo}>
      <View>
        <View style={styles.flextype}>
          <View>
            <Text category="h4">{name}</Text>
            <Text category="p1">Phone Number: {phoneNumber}</Text>
          </View>
        </View>
        <View style={{ marginHorizontal: "1%" }}>
          <Divider />
          <Text style={{ marginBottom: 2 }} category="p1">
            {location}
          </Text>
        </View>
      </View>
    </Card>
  );
};

export default ApplicantCard;

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
