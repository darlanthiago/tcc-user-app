import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useToast } from "native-base";
import React, { useCallback, useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { RootStackParamList } from "../../routes/public.routes";

import { api } from "../../services/api";
import { formatAndValidDateISO } from "../../utils/checkDate";

type Truck = {
  name: string;
  email: string;
  password: string;
  birth_date: string;
};

type registerScreenProp = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

export const RegisterScreen = () => {
  const toast = useToast();
  const navigation = useNavigation<registerScreenProp>();
  const [newTruck, setNewTruck] = useState({} as Truck);
  const [isLoading, setIsLoading] = useState(false);

  const create = useCallback(async () => {
    const { name, email, password, birth_date } = newTruck;

    setIsLoading(true);

    if (!name && !email && !password && !birth_date) {
      toast.show({
        placement: "top",
        title: "Ops!",
        status: "error",
        description: "Adicione todos os dados",
      });

      setIsLoading(false);
      return;
    }

    if (!formatAndValidDateISO(birth_date).isDate) {
      toast.show({
        placement: "top",
        title: "Ops!",
        status: "error",
        description: "Data Inválida",
      });

      setIsLoading(false);
      return;
    }

    const userToAdd = {
      name,
      email,
      password,
      birth_date: formatAndValidDateISO(birth_date).parsedDate,
    };

    await api
      .post("/user", userToAdd)
      .then((resp) => {
        setIsLoading(false);

        toast.show({
          placement: "top",
          title: "Sucesso",
          status: "success",
          description: "Usuário adicionado com sucesso",
        });

        navigation.navigate("Login");
        return;
      })
      .catch((error) => {
        setIsLoading(false);

        toast.show({
          placement: "top",
          title: "Ops!",
          status: "error",
          description: "Verifique os dados e tente novamente",
        });

        return;
      });
  }, [toast]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.title}>Cadastrar</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome"
        onChangeText={(text) => setNewTruck({ ...newTruck, name: text })}
        value={newTruck.name}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Digite o email"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(text) => setNewTruck({ ...newTruck, email: text })}
        value={newTruck.email}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite a senha"
        keyboardType="default"
        autoCapitalize="none"
        onChangeText={(text) => setNewTruck({ ...newTruck, password: text })}
        value={newTruck.password}
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        placeholder="Data de nascimento: 11/05/1998"
        onChangeText={(text) => setNewTruck({ ...newTruck, birth_date: text })}
        value={newTruck.birth_date}
      />

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.9}
        onPress={create}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Aguarde ..." : "Cadastrar"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.link}
        activeOpacity={0.9}
        onPress={() => {
          navigation.navigate("Login");
        }}
      >
        <Text style={styles.linkText}>Ja tenho uma conta</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  title: {
    fontSize: 40,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#ddd",
    width: "100%",
    height: 45,
    borderRadius: 8,
    marginVertical: 4,
    paddingHorizontal: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#5758BB",
    height: 45,
    borderRadius: 8,
    marginVertical: 4,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
  },
  link: {
    width: "100%",
    height: 45,
    borderRadius: 8,
    marginVertical: 4,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  linkText: {
    color: "#0d6efd",
  },
});
