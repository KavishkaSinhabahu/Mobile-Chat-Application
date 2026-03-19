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
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";

SplashScreen.preventAutoHideAsync();

const logoPath = require("../assets/images/logonsc.png");

export default function signup() {
  const [getMobile, setMobile] = useState("");
  const [getPassword, setPassword] = useState("");

  const [loaded, error] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Italic": require("../assets/fonts/Poppins-Italic.ttf"),
  });

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
      <StatusBar style="auto" hidden={false} />
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
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

                <Text style={stylesheet.text1}>Register to Your Chat</Text>

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
                    router.replace("/signupl?mobile="+getMobile+"&password="+getPassword);
                  }}
                >
                  <FontAwesome name="sign-in" size={18} color={"white"} />
                  <Text style={stylesheet.text3}>NEXT</Text>
                </Pressable>

                  <Pressable
                    style={stylesheet.button2}
                    onPress={() => {
                      router.replace("/");
                    }}
                  >
                    <Text style={stylesheet.text4}>
                      Already have an Account? Sign In Here ...
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
    paddingTop: 70,
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
