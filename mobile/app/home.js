import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { FontAwesome, Ionicons, Octicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { Link, router, Stack } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function home() {
  const [getChatArray, setChatArray] = useState([]);
  const [getUser, setUser] = useState("");

  const [loaded, error] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Italic": require("../assets/fonts/Poppins-Italic.ttf"),
  });

  useEffect(() => {
  let intervalId;
    
    async function fetchData() {
      let userJson = await AsyncStorage.getItem("user");
      let user = JSON.parse(userJson);
      setUser(user);
      let response = await fetch(
        process.env.EXPO_PUBLIC_URL + "LoadHomeData?id=" + user.id
      );

      if (response.ok) {
        let json = await response.json();

        if (json.success) {
          let chatArray = json.jsonChatArray;
          setChatArray(chatArray);
        }
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
        <View style={stylesheet.view2_1}>
          <Text style={stylesheet.text}>Messages</Text>
        </View>
        <Pressable
          onPress={() => {
            router.push({
              pathname: "/profile",
              params: getUser,
            });
          }}
          style={stylesheet.view2_2}
        >
          <Image
            source={
              process.env.EXPO_PUBLIC_URL +
              "AvatarImages/" +
              getUser.mobile +
              ".png"
            }
            style={stylesheet.image1}
            contentFit="contain"
          />
        </Pressable>
      </View>

      <FlashList
        showsVerticalScrollIndicator={false}
        data={getChatArray}
        renderItem={({ item }) => (
          <Pressable
            style={stylesheet.view5}
            onPress={() => {
              router.push({
                pathname: "/chat",
                params: item,
              });
            }}
          >
            <View style={stylesheet.view6}>
              {item.other_user_image ? (
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
                <Text style={stylesheet.text6}>
                  {item.other_user_image_letters}
                </Text>
              )}
            </View>

            <View style={stylesheet.view9}>
              <View style={stylesheet.view4}>
                <View style={{ flexDirection: "row", columnGap: 5 }}>
                  <Text style={stylesheet.text1}>{item.other_user_name}</Text>
                  <Octicons
                    name="dot-fill"
                    size={18}
                    color={
                      item.other_user_status == 1 ? "rgb(60,154,40)" : "white"
                    }
                  />
                </View>
                <Text style={stylesheet.text4} numberOfLines={1}>
                  {item.message}
                </Text>
              </View>

              <View style={stylesheet.view8}>
                <View style={stylesheet.view7}>
                  <Text style={stylesheet.text5}>{item.dateTime}</Text>
                  {item.chat_man ? (
                    <Ionicons
                      name="checkmark-done-sharp"
                      size={16}
                      color={item.chat_status_id == 1 ? "#24a0ed" : "gray"}
                    />
                  ) : item.chat_unseen_count != 0 ? (
                    item.message != "Say Hi!" ? (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "rgb(60,154,40)",
                          height: 18,
                          width: 18,
                          borderRadius: 9,
                        }}
                      >
                        <Text style={{ color: "white", fontSize: 13 }}>
                          {item.chat_unseen_count}
                        </Text>
                      </View>
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )}
                </View>
              </View>
            </View>
          </Pressable>
        )}
        estimatedItemSize={200}
      />
    </View>
  );
}

const stylesheet = StyleSheet.create({
  view1: {
    flex: 1,
    paddingTop: 20,
  },
  view2: {
    flexDirection: "row",
    paddingHorizontal: 20,
    // backgroundColor: "yellow",
  },
  view2_1: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 10,
    // backgroundColor: "orange",
  },
  view2_2: {
    width: 60,
    height: 60,
    borderRadius: 30,
    // borderWidth: 1,
    // borderColor: "black",
  },
  view3: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "black",
  },
  view4: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontFamily: "Poppins-Bold",
    fontSize: 30,
    // color: "rgb(60,154,40)",
  },
  text1: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
  },
  text2: {
    fontFamily: "Poppins-Light",
    fontSize: 16,
  },
  text3: {
    fontFamily: "Poppins-Light",
    fontSize: 14,
    alignSelf: "flex-end",
  },
  view5: {
    flexDirection: "row",
    columnGap: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  view6: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 0.5,
    justifyContent: "center",
    alignItems: "center",
    // borderColor: "rgb(60,154,40)",
    // borderStyle: "dotted",
  },
  text4: {
    fontFamily: "Poppins-Light",
    fontSize: 14,
  },
  text5: {
    fontFamily: "Poppins-Light",
    fontSize: 12,
  },
  view7: {
    flex: 1,
    paddingTop: 10,
    rowGap: 5,
    alignItems: "flex-end",
    alignSelf: "flex-end",
  },
  view8: {
    alignItems: "center",
  },
  view9: {
    flex: 1,
    flexDirection: "row",
    columnGap: 10,
    borderBottomWidth: 1,
    borderBlockColor: "lightgray",
    paddingBottom: 10,
  },
  text6: {
    alignSelf: "center",
    fontFamily: "Poppins-Bold",
    fontSize: 24,
  },
  image1: {
    alignSelf: "center",
    height: 55,
    width: 55,
    borderRadius: 30,
  },
});
