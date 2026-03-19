import { FontAwesome, Ionicons, Octicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

SplashScreen.preventAutoHideAsync();

export default function profile() {
  const getUser = useLocalSearchParams();

  const [getImage, setImage] = useState(
    process.env.EXPO_PUBLIC_URL + "AvatarImages/" + getUser.mobile + ".png"
  );

  const [loaded, error] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Italic": require("../assets/fonts/Poppins-Italic.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
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
      <StatusBar style="auto" />

      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={stylesheet.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <View style={stylesheet.view2}>
              <Pressable
                onPress={() => {
                  router.back("/home");
                }}
              >
                <Ionicons name="chevron-back" size={24} color="black" />
              </Pressable>
              <View style={stylesheet.view3}>
                <Text style={stylesheet.text1}>Profile</Text>
              </View>
            </View>

            <View style={stylesheet.view4}>
              <Pressable style={stylesheet.avatar1}>
                <View>
                  {getImage != "null" ? (
                    <Image
                      source={getImage}
                      style={stylesheet.avatar1}
                      contentFit="contain"
                    />
                  ) : (
                    <Text style={stylesheet.text5}>
                      {getUser.first_name.charAt(0) + "" + getUser.last_name.charAt(0)}
                    </Text>
                  )}
                </View>
              </Pressable>
              <Text style={stylesheet.text3}>
                {getUser.first_name + " " + getUser.last_name}
              </Text>
              <Text style={stylesheet.text2}>{getUser.mobile}</Text>
            </View>
            <View style={stylesheet.view5}>
              <Pressable
                style={stylesheet.button1}
                onPress={async () => {
                  let response = await fetch(
                    process.env.EXPO_PUBLIC_URL +
                      "UpdateProfile?id=" +
                      getUser.id
                  );

                  if (response.ok) {
                    let json = await response.json();

                    if (json.success) {
                      await AsyncStorage.setItem("user", "");
                      router.replace("/");
                    }
                  }
                }}
              >
                <Text style={stylesheet.text4}>LOGOUT</Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const stylesheet = StyleSheet.create({
  view1: {
    flex: 1,
  },
  view2: {
    flexDirection: "row",
    columnGap: 10,
    marginTop: 15,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "yellow",
  },
  view3: {
    flex: 1,
  },
  text1: {
    fontFamily: "Poppins-Bold",
    fontSize: 22,
    paddingHorizontal: 120,
  },
  avatar1: {
    width: 130,
    height: 130,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 7,
  },
  view4: {
    rowGap: 3,
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  text2: {
    fontFamily: "Poppins-Regular",
    color: "gray",
    fontSize: 16,
  },
  text3: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
  },
  input1: {
    marginTop: 30,
    borderWidth: 1,
    borderRadius: 13,
    width: "100%",
    height: 140,
    padding: 15,
    fontSize: 18,
    fontFamily: "Poppins-Light",
    borderColor: "lightgray",
  },
  view5: {
    paddingHorizontal: 20,
    marginTop: 280,
  },
  button1: {
    flexDirection: "row",
    columnGap: 10,
    marginTop: 10,
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 15,
    height: 47,
    justifyContent: "center",
    alignItems: "center",
  },
  text4: {
    fontFamily: "Poppins-Regular",
    fontSize: 18,
    color: "red",
  },
  text5: {
    alignSelf: "center",
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: "red"
  },
});
