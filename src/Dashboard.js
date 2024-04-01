import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Button,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { Camera } from "expo-camera";
import * as Sharing from "expo-sharing";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";

export default function Dashboard() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const { uri } = await cameraRef.current.takePictureAsync();
      setPhoto(uri);
    }
  };

  const sharePhoto = async () => {
    try {
      if (!photo) return;
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(photo);
      } else {
        Alert.alert(
          "Teilen nicht verfügbar",
          "Das Teilen ist auf diesem Gerät nicht möglich."
        );
      }
    } catch (error) {
      Alert.alert(
        "Fehler beim Teilen",
        "Beim Teilen des Fotos ist ein Fehler aufgetreten."
      );
    }
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      Alert.alert(
        "Fehler beim Ausloggen",
        "Beim Ausloggen ist ein Fehler aufgetreten."
      );
    }
  };

  if (hasPermission === false) {
    return <Text>Kein Zugriff auf die Kamera.</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <TouchableOpacity onPress={takePhoto} style={styles.captureButton}>
          <Text style={styles.captureButtonText}>Foto aufnehmen</Text>
        </TouchableOpacity>
      </Camera>
      {photo && (
        <View style={styles.photoPreviewContainer}>
          <Image source={{ uri: photo }} style={styles.photoPreview} />
          <Button title="Teilen" onPress={sharePhoto} />
        </View>
      )}
      <Button title="Logout" onPress={handleLogout} color="#841584" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 3,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  captureButton: {
    alignSelf: "center",
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 40,
  },
  captureButtonText: {
    fontSize: 18,
    color: "#000",
  },
  photoPreviewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  photoPreview: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});
