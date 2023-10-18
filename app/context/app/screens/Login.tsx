import { View, Image, StyleSheet, TextInput, Button } from "react-native";
import React, { useState } from "react";
import { useAuth } from "../../AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { onLogin, onRegister } = useAuth();

  const login = async () => {
    const result = await onLogin!(username, password);
    if (result && result.error) {
      alert(result.message);
    }
  };

  const register = async () => {
    const result = await onRegister!(username, password);
    if (result && result.error) {
      alert(result.message);
    } else {
      login();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/GNOME_Todo_icon_2019.svg/2048px-GNOME_Todo_icon_2019.svg.png",
          }}
          style={styles.image}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          onChangeText={(text: string) => {
            setUsername(text);
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          autoCapitalize="none"
          secureTextEntry={true}
          onChangeText={(text: string) => {
            setPassword(text);
          }}
        />
        <Button onPress={login} title="Sign In" />
        <Button onPress={register} title="Create Account" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "50%",
    resizeMode: "contain",
    alignContent: "center",
  },
  form: {
    gap: 10,
    width: "60%",
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  container: {
    alignItems: "center",
    width: "100%",
  },
});
export default Login;
