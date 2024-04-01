import React, { useState, useEffect } from "react";
import { Pedometer } from "expo-sensors";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";

export default function Dashboard() {
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    const subscribe = Pedometer.watchStepCount((result) => {
      setCurrentStepCount(result.steps);
    });

    return () => subscribe.remove();
  }, []);

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.log("ERROR during Logout: ", error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "#BEBDB8" }}>
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          marginBottom: 40,
          marginTop: 150,
        }}
      >
        Willkommen im Dashboard
      </Text>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>
        Schritte heute: {currentStepCount}
      </Text>
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: "#841584",
          padding: 10,
          borderRadius: 5,
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}
