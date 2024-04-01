import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [ code, setCode ] = useState("");
    const [ confirm, setConfirm ] = useState(null);
    const navigation = useNavigation();

    const signInWithPhoneNumber = async () => {
        try {
            const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
            setConfirm(confirmation);

        } catch (error) {
            console.log("ERROR sending code:", error)
        }
    };

    const confirmCode = async () => {
        try {
            const userCredential = await confirm.confirm(code);
            const user = userCredential.user;

            // Schauen ob es den User schon gibt
            const userDocument = await firestore()
                .collection("users")
                .doc(user.uid)
                .get();
            
                if (userDocument.exists) {
                    //Bestehende User zum Dashboard navigieren
                    navigation.navigate("Dashboard");
                } else {
                    // Neue User zu Detail navigieren
                    navigation.navigate("Detail", { uid: user.uid });
                }
        } catch (error) {
            console.log("Invalide code: ", error);
        }
    };

    return(
        <View style={{flex: 1, padding: 10, backgroundColor: "#BEBDB8"}}>
            <Text style={{fontSize: 32, fontWeight: "bold", marginBottom: 40, marginTop: 150}}>
                Handynummer Authentikation mit Firebase
            </Text>
            {!confirm ? (
                <>
                    <Text style={{marginBottom: 20, fontSize: 18}}>
                        Gib deine Handynummer ein: 
                    </Text>
                    <TextInput style={{height: 50, width: "100%", borderColor: "black", borderWidth: 1, marginBottom: 30, paddingHorizontal: 10}} 
                        placeholder="z.B., +41 76 270 09 98"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                    />
                    <TouchableOpacity
                        onPress={signInWithPhoneNumber}
                        style={{
                            backgroundColor: "#841584",
                            padding: 10,
                            borderRadius: 5,
                            marginBottom: 20,
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ color: "white", fontSize: 22, fontWeight: "bold"}}>
                            Sende Code
                        </Text>
                    </TouchableOpacity>
                </>
            ) : ( 
                <>
                    <Text style={{marginBottom: 20, fontSize: 18 }}>
                        Gib den Code ein der gesedet wurde
                    </Text>
                    <TextInput
                        style={{height: 50, width: "100%", borderColor: "black", borderWidth: 1, marginBottom: 30, paddingHorizontal: 10}}
                        placeholder="Gib den Code ein"
                        value={code}
                        onChangeText={setCode}
                    />
                    <TouchableOpacity
                        onPress={confirmCode}
                        style={{
                            backgroundColor: "#841584",
                            padding: 10,
                            borderRadius: 5,
                            marginBottom: 20,
                            alignItems: "center",
                        }}
                    >
                        <Text style={{color: "white", fontSize: 22, fontWeight: "bold"}}>
                            Betsätige Coode
                        </Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    )
};
