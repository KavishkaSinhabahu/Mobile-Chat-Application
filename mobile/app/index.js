import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { registerRootComponent } from "expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

SplashScreen.preventAutoHideAsync();

const logoPath = require("../assets/images/logonsc.png");

export default function signin() {
  const [getMobile, setMobile] = useState("");
  const [getPassword, setPassword] = useState("");

  const [loaded, error] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Italic": require("../assets/fonts/Poppins-Italic.ttf"),
  });

  useEffect(() => {
    async function checkUser() {
      try {
        let userJson = await AsyncStorage.getItem("user");
        if (userJson != null) {
          router.replace("/home");
        }
      } catch (e) {
        console.log(e);
      }
    }
    checkUser();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={stylesheet.view1}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={stylesheet.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={stylesheet.inner}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={stylesheet.view2}>
                <Image
                  source={logoPath}
                  style={stylesheet.image1}
                  contentFit="contain"
                />

                <Text style={stylesheet.text1}>Welcome to Your Chat</Text>

                <Text style={stylesheet.text2}>Mobile</Text>
                <TextInput
                  style={stylesheet.input1}
                  inputMode="tel"
                  placeholder="07xxxxxxxx"
                  maxLength={10}
                  onChangeText={(text) => {
                    setMobile(text);
                  }}
                />

                <Text style={stylesheet.text2}>Password</Text>
                <TextInput
                  style={stylesheet.input1}
                  secureTextEntry={true}
                  placeholder=". . . . . . . ."
                  maxLength={20}
                  onChangeText={(text) => {
                    setPassword(text);
                  }}
                />

                <Pressable
                  style={stylesheet.button1}
                  onPress={async () => {
                    let response = await fetch(
                      process.env.EXPO_PUBLIC_URL+"SignIn",
                      {
                        method: "POST",
                        body: JSON.stringify({
                          mobile: getMobile,
                          password: getPassword,
                        }),
                        headers: {
                          "Content-Type": "application/json",
                        },
                      }
                    );

                    if (response.ok) {
                      let json = await response.json();

                      if (json.success) {
                        let user = json.user;

                        try {
                          await AsyncStorage.setItem(
                            "user",
                            JSON.stringify(user)
                          );
                          router.replace("/home");
                        } catch (e) {
                          Alert.alert(
                            "Error",
                            "Unable to process your request."
                          );
                        }
                      } else {
                        Alert.alert("Error", json.message);
                      }
                    }
                  }}
                >
                  <FontAwesome name="sign-in" size={18} color={"white"} />
                  <Text style={stylesheet.text3}>SIGN IN</Text>
                </Pressable>

                <Pressable
                  style={stylesheet.button2}
                  onPress={() => {
                    router.replace("/signupf");
                  }}
                >
                  <Text style={stylesheet.text4}>
                    New User? Register Here ...
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const stylesheet = StyleSheet.create({
  view1: {
    flex: 1,
    justifyContent: "center",
  },
  view2: {
    rowGap: 10,
    paddingTop: 60,
  },
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "space-around",
  },
  bg1: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 20,
    height: "100%",
  },
  text1: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    color: "rgb(60,154,40)",
    alignSelf: "center",
    marginBottom: 30,
  },
  text2: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "rgb(60,154,40)",
  },
  text3: {
    fontSize: 18,
    color: "white",
    fontFamily: "Poppins-Bold",
  },
  text4: {
    color: "black",
    fontFamily: "Poppins-Italic",
    textDecorationLine: "underline",
  },
  input1: {
    borderWidth: 1,
    borderRadius: 13,
    width: "100%",
    height: 43,
    paddingLeft: 15,
    fontSize: 18,
    fontFamily: "Poppins-Light",
    borderColor: "rgb(60,154,40)",
  },
  button1: {
    flexDirection: "row",
    columnGap: 10,
    marginTop: 10,
    backgroundColor: "rgb(60,154,40)",
    borderRadius: 15,
    height: 47,
    justifyContent: "center",
    alignItems: "center",
  },
  button2: {
    flexDirection: "row",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  image1: {
    alignSelf: "center",
    height: 130,
    width: "100%",
  },
});
