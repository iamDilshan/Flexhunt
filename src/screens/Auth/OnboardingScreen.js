import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import { useNavigation } from "@react-navigation/native";
import { Layout, Text } from "@ui-kitten/components";
import Screen from "../../components/Screen";
import StatusBar from "expo-status-bar";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const navigation = useNavigation();

  const handleDone = () => {
    navigation.navigate("Login");
  };

  const doneButton = ({ ...props }) => {
    return (
      <TouchableOpacity style={styles.doneButton} {...props}>
        <Text category="p1" style={{ padding: 6 }}>
          Login
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Screen>
      <Layout style={{}}>
        <View style={styles.container}>
          <Onboarding
            onDone={handleDone}
            onSkip={handleDone}
            bottomBarHeight={60}
            bottomBarColor="#2CCFA1"
            bottomBarHighlight={false}
            DoneButtonComponent={doneButton}
            containerStyles={{ paddingHorizontal: "10%" }}
            pages={[
              {
                backgroundColor: "#ffff",
                title: "",
                image: (
                  <Image
                    source={require("../../../assets/Onboarding/Logo_1.png")}
                  />
                ),
                subtitle: "",
              },
              {
                backgroundColor: "#ffff",
                title: "Welocme to",
                image: (
                  <View>
                    <Image
                      source={require("../../../assets/Onboarding/Onboarding_1.png")}
                    />
                  </View>
                ),
                subtitle:
                  "Explore, Connect, Thrive Welcome to FlexHunt, your gateway to flexible part time opportunities!",
              },
              {
                backgroundColor: "#ffff",
                title: "We are the Best Part time Job Portal Platform",
                image: (
                  <View style={styles.OnboardingImg}>
                    <Image
                      source={require("../../../assets/Onboarding/Onboarding_2.png")}
                    />
                  </View>
                ),
                subtitle:
                  "Why settle for ordinary when you can choose the best? FlexHunt Your Ultimate Part-Time job Destination.",
              },
              {
                backgroundColor: "#ffff",
                title: "The Place Where Work Finds You",
                image: (
                  <View style={styles.OnboardingImg}>
                    <Image
                      source={require("../../../assets/Onboarding/Onboarding_3.png")}
                    />
                  </View>
                ),
                subtitle:
                  "Let Opportunities Come to You. FlexHunt - The Place Where Work Finds You!",
              },
              {
                backgroundColor: "#ffff",
                title: "Let's start your career with us now!",
                image: (
                  <Image
                    source={require("../../../assets/Onboarding/Onboarding_4.png")}
                  />
                ),
                subtitle:
                  "Embark on Your Career Journey. Flex Hunt - Your Partner in Part time Success.",
              },
            ]}
          />
        </View>
      </Layout>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffff",
    width: width,
    height: height,
  },
  doneButton: {
    backgroundColor: "#2CCFA1",
  },
});
