// ChatCard.js
import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Layout, Text, Avatar } from "@ui-kitten/components";

const ChatCard = ({ chat, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.cardContainer}>
      <Avatar source={{ uri: chat.user.avatar }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text category="s1" style={styles.nameText}>
          {chat.user.name}
        </Text>
        <Text category="c1" style={styles.messageText}>
          {chat.text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ebebeb",
  },
  avatar: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  nameText: {
    fontWeight: "bold",
  },
  messageText: {
    color: "gray",
  },
});

export default ChatCard;
