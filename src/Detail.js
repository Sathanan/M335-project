import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import firestore from "@react-native-firebase/firestore";

export default function Detail({ route, navigation }) {
  const { uid } = route.params;
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

  const saveDetails = async () => {
    try {
      await firestore().collection("users").doc(uid).set({
        name,
        dob,
        gender,
      });

      //Navigieren zum Dashboard nach dem speichern
      navigation.navigate("Dashboard");
    } catch (error) {
      console.log("ERROR saving details: ", error);
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
        Gib deine Angaben ein
      </Text>
      <TextInput
        style={{
          height: 50,
          width: "100%",
          borderColor: "black",
          borderWidth: 1,
          marginBottom: 30,
          paddingHorizontal: 10,
        }}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={{
          height: 50,
          width: "100%",
          borderColor: "black",
          borderWidth: 1,
          marginBottom: 30,
          paddingHorizontal: 10,
        }}
        placeholder="Geburtsdatum"
        value={dob}
        onChangeText={setDob}
      />
      <TextInput
        style={{
          height: 50,
          width: "100%",
          borderColor: "black",
          borderWidth: 1,
          marginBottom: 30,
          paddingHorizontal: 10,
        }}
        placeholder="Geschlächt"
        value={gender}
        onChangeText={setGender}
      />
      <TouchableOpacity
        onPress={saveDetails}
        style={{
          backgroundColor: "#841584",
          padding: 10,
          borderRadius: 5,
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>
          Speichere deine Daten
        </Text>
      </TouchableOpacity>
    </View>
  );
}
