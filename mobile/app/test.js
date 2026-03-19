import AsyncStorage from "@react-native-async-storage/async-storage"

async () => {
    let user = await AsyncStorage.getItem("user");
}