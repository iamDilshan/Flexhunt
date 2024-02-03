import React from "react";
import { ScrollView, Image } from "react-native";
import { Card, Layout, Text, Button } from "@ui-kitten/components";
import Screen from "../../components/Screen";

export default function ({ navigation }) {
  return (
    <Screen
      backAction={() => {
        navigation.goBack();
      }}
      headerTitle={"Login"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <Layout
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            resizeMode="contain"
            style={{
              height: 200,
              width: 200,
            }}
            source={require("../../../assets/images/Logo_3.png")}
          />
        </Layout>
        <Layout
          style={{
            flex: 3,
            paddingHorizontal: 20,
            paddingBottom: 20,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: 10,
            }}
            category="h3"
          >
            Choose Your Job Type
          </Text>
          <Text
            style={{
              textAlign: "center",
            }}
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s
          </Text>
          <Layout
            style={{
              flex: 1,
              marginTop: "5%",
              alignItems: "top",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <Card
              disabled
              status="success"
              style={{
                marginHorizontal: "1%",
                marginVertical: "1%",
                width: 175,
                height: 270,
                borderColor: "#03fc28",
              }}
            >
              <Layout
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  resizeMode="contain"
                  style={{
                    height: 50,
                    width: 50,
                    marginBottom: "15%",
                  }}
                  source={require("../../../assets/images/Asset_1.png")}
                />
                <Text
                  category="h6"
                  style={{
                    marginBottom: 10,
                    textAlign: "center",
                  }}
                >
                  Job
                </Text>
                <Text
                  style={{
                    marginVertical: 5,
                    textAlign: "center",
                  }}
                >
                  I want to find a job for Me
                </Text>
                <Button
                  onPress={() => {
                    navigation.navigate("Details", {
                      type: 0,
                    });
                  }}
                  style={{
                    borderRadius: 5,
                    marginVertical: 10,
                  }}
                  status="success"
                >
                  Choose
                </Button>
              </Layout>
            </Card>
            <Card
              disabled
              status="danger"
              style={{
                marginHorizontal: "1%",
                marginVertical: "1%",
                width: 175,
                height: 270,
                borderColor: "#fc0307",
              }}
            >
              <Layout
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  resizeMode="contain"
                  style={{
                    height: 50,
                    width: 50,
                    marginBottom: "15%",
                  }}
                  source={require("../../../assets/images/Asset_2.png")}
                />
                <Text
                  category="h6"
                  style={{
                    fontWeight: "bold",
                    marginBottom: 15,
                    textAlign: "center",
                  }}
                >
                  Employee
                </Text>
                <Text
                  style={{
                    marginVertical: 5,
                    textAlign: "center",
                  }}
                >
                  I want to find Employee
                </Text>
                <Button
                  onPress={() => {
                    navigation.navigate("Details", {
                      type: 1,
                    });
                  }}
                  style={{
                    borderRadius: 5,
                    marginVertical: 10,
                  }}
                  status="danger"
                >
                  Choose
                </Button>
              </Layout>
            </Card>
          </Layout>
        </Layout>
      </ScrollView>
    </Screen>
  );
}
