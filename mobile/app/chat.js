import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";

SplashScreen.preventAutoHideAsync();

export default function Chat() {
  const item = useLocalSearchParams();

  const [getChatText, setChatText] = useState("");
  const [getUser, setUser] = useState("");
  const [getChatArray, setChatArray] = useState([]);

  const [loaded, error] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Italic": require("../assets/fonts/Poppins-Italic.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
  });

  useEffect(() => {
    let intervalId;

    async function fetchData() {
      let userJson = await AsyncStorage.getItem("user");
      let user = JSON.parse(userJson);
      setUser(user);
      let response = await fetch(
        process.env.EXPO_PUBLIC_URL +
          "LoadChat?user_id=" +
          user.id +
          "&other_user_id=" +
          item.other_user_id
      );

      if (response.ok) {
        let chatArray = await response.json();
        setChatArray(chatArray);
      }
    }

    fetchData();

    intervalId = setInterval(() => {
      fetchData();
    }, 3000);

    return () => clearInterval(intervalId);
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

      <View style={stylesheet.view2}>
        <Pressable
          onPress={() => {
            router.back("/home");
          }}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </Pressable>

        <View style={stylesheet.view3}>
          {item.other_user_image === "true" ? (
            <Image
              source={
                process.env.EXPO_PUBLIC_URL +
                "AvatarImages/" +
                item.other_user_mobile +
                ".png"
              }
              style={stylesheet.image1}
              contentFit="contain"
            />
          ) : (
            <Text style={stylesheet.text1}>
              {item.other_user_image_letters}
            </Text>
          )}
        </View>

        <View style={stylesheet.view4}>
          <Text style={stylesheet.text2}>{item.other_user_name}</Text>
          <Text style={stylesheet.text3}>
            {item.other_user_status === 1 ? "Online" : "Offline"}
          </Text>
        </View>
      </View>

      <View style={{ flex: 1, paddingTop: 10, backgroundColor: "lightgray" }}>
        <FlashList
          data={getChatArray}
          renderItem={({ item }) => (
            <View
              style={
                item.side === "right" ? stylesheet.view5 : stylesheet.view7
              }
            >
              <Text style={stylesheet.text3}>{item.message}</Text>
              <View style={stylesheet.view6}>
                <Text style={stylesheet.text4}>{item.datetime}</Text>
                {item.side === "right" ? (
                  <Ionicons
                    name="checkmark-done-sharp"
                    size={16}
                    color={item.status === 1 ? "#24a0ed" : "gray"}
                  />
                ) : null}
              </View>
            </View>
          )}
          estimatedItemSize={200}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={stylesheet.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {/* <View> */}

          <View style={stylesheet.view9}>
            <TextInput
              style={stylesheet.input1}
              value={getChatText}
              onChangeText={(text) => {
                setChatText(text);
              }}
            />
            <Pressable
              style={stylesheet.btn1}
              onPress={async () => {
                if (getChatText.length === 0) {
                  Alert.alert("Warning", "Please enter your message.");
                } else {
                  let response = await fetch(
                    process.env.EXPO_PUBLIC_URL +
                      "SendChat?user_id=" +
                      getUser.id +
                      "&other_user_id=" +
                      item.other_user_id +
                      "&message=" +
                      getChatText
                  );

                  if (response.ok) {
                    let json = await response.json();

                    if (json.success) {
                      setChatText("");
                    }
                  }
                }
              }}
            >
              <FontAwesome name="paper-plane" size={20} color={"black"} />
            </Pressable>
          </View>
          {/* </View> */}
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
    paddingHorizontal: 5,
    alignItems: "center",
  },
  view3: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  view4: {
    justifyContent: "center",
  },
  text1: {
    alignSelf: "center",
    fontFamily: "Poppins-Bold",
    fontSize: 20,
  },
  image1: {
    alignSelf: "center",
    height: 45,
    width: 45,
    borderRadius: 25,
  },
  text2: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
  },
  text3: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
  },
  view5: {
    backgroundColor: "lightgreen",
    width: "contain",
    rowGap: 5,
    borderRadius: 15,
    marginHorizontal: 15,
    marginVertical: 7,
    padding: 10,
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  view6: {
    flexDirection: "row",
    columnGap: 5,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  text4: {
    fontSize: 12,
  },
  view7: {
    backgroundColor: "white",
    width: "contain",
    rowGap: 5,
    borderRadius: 15,
    marginHorizontal: 15,
    marginVertical: 7,
    padding: 10,
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  view9: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    marginHorizontal: 5,
    borderTopColor: "lightgray",
    borderTopWidth: 1,
    padding: 10,
    justifyContent: "space-around",
  },
  input1: {
    height: 35,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "gray",
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: "Poppins-Light",
  },
  btn1: {},
});
