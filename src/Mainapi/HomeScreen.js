/* eslint-disable */

import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const HomeScreen = ({ navigation }) => {

    const handleLogin = () => {
        // Navigate to the Login screen
        navigation.navigate('Login');
    };

    return(
        <View>
        <Text>Home Screeenn</Text>
            <TouchableOpacity onPress={handleLogin}>
                <Text>Home Screen</Text>
            </TouchableOpacity>
        </View>
    );
}

export default HomeScreen;
