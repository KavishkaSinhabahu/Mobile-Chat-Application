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
import * as ImagePicker from "expo-image-picker";
import { registerRootComponent } from "expo";
import { router, useLocalSearchParams } from "expo-router";

SplashScreen.preventAutoHideAsync();

const userLogo = require("../assets/images/avatar.jpg");

export default function signup() {
  const item = useLocalSearchParams();
  const mobile = item.mobile;
  const password = item.password;

  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");

  const [getImage, setImage] = useState(userLogo);

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
                <Pressable
                  style={stylesheet.avatar1}
                  onPress={async () => {
                    let result = await ImagePicker.launchImageLibraryAsync({
                      // mediaTypes: ImagePicker.MediaTypeOptions.Images,
                      allowsEditing: true,
                    });

                    if (!result.canceled) {
                      setImage(result.assets[0].uri);
                    }
                  }}
                >
                  <Image
                    source={getImage}
                    style={stylesheet.avatar1}
                    contentFit="contain"
                  />
                </Pressable>

                <TextInput
                  style={stylesheet.input1}
                  onChangeText={(text) => {
                    setFirstName(text);
                  }}
                  placeholder="Your First Name Here ..."
                />

                <TextInput
                  style={stylesheet.input1}
                  onChangeText={(text) => {
                    setLastName(text);
                  }}
                  placeholder="Your Last Name Here ..."
                />

                <Pressable
                  style={stylesheet.button1}
                  onPress={async () => {

                    let formData = new FormData();
                    formData.append("mobile",mobile);
                    formData.append("firstName", getFirstName);
                    formData.append("lastName", getLastName);
                    formData.append("password",password);

                    if (getImage != userLogo) {
                      formData.append("avatarImage", {
                        uri: getImage,
                      });
                    }

                    let response = await fetch(
                      process.env.EXPO_PUBLIC_URL+"SignUp",
                      {
                        method: "POST",
                        body: formData,
                      }
                    );

                    if (response.ok) {
                      let json = await response.json();

                      if (json.success) {
                        router.replace("/");
                      } else {
                        Alert.alert("Error", json.message);
                      }
                    }
                  }}
                >
                  <FontAwesome name="sign-in" size={18} color={"white"} />
                  <Text style={stylesheet.text3}>REGISTER</Text>
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
    rowGap: 20,
    paddingTop: 125,
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
    marginTop: 20,
    backgroundColor: "rgb(60,154,40)",
    borderRadius: 15,
    height: 47,
    justifyContent: "center",
    alignItems: "center",
  },
  image1: {
    alignSelf: "center",
    height: 130,
    width: "100%",
  },
  avatar1: {
    width: 130,
    height: 130,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 35,
  },
});
