import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../AuthContext";
import Todo from "../../../../components/Todo";

const Home = () => {
  const [newTodo, setNewTodo] = useState("");
  const [todoList, setTodoList] = useState([{ id: 0, title: "" }]);

  const refreshTodosList = async () => {
    const result = await axios.get(`${API_URL}/todo`);
    setTodoList(
      (result.data as [any]).map((item) => {
        return { id: item.id, title: item.title };
      })
    );
  };

  const createTodo = async (title: string) => {
    try {
      await axios.post(`${API_URL}/todo`, { title, content: "" });
      refreshTodosList();
    } catch (err) {
      return { error: true, message: (err as any).response.data.message };
    }
  };

  const deleteTodo = async (todoId: number) => {
    try {
      await axios.delete(`${API_URL}/todo/${todoId}`);
      refreshTodosList();
    } catch (err) {
      return { error: true, message: (err as any).response.data.message };
    }
  };

  const handleAddTodo = async () => {
    Keyboard.dismiss();
    const result = await createTodo(newTodo);
    if (result && result.error) {
      alert(result.message);
    }
    refreshTodosList();
    setNewTodo("");
  };

  const completeTodo = async (todoId: number) => {
    Alert.alert("Delete Todo", "Are you want to delete this Todo", [
      {
        text: "Cancel",
      },
      {
        text: "Confirm",
        onPress: async () => {
          const result = await deleteTodo(todoId);
          if (result && result.error) {
            alert(result.message);
          }
        },
      },
    ]);
  };
  useEffect(() => {
    refreshTodosList();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.todosWrapper}>
        <Text style={styles.sectionTitle}>TODOs</Text>
        <ScrollView style={styles.items}>
          {todoList.map((item, index) => {
            return (
              <TouchableOpacity
                key={item.id as unknown as number}
                onPress={() => completeTodo(item.id as unknown as number)}
              >
                <Todo title={item.title} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.addTodoWrapper}
      >
        <TextInput
          style={styles.input}
          placeholder="Write a TODO here"
          value={newTodo}
          onChangeText={(text) => setNewTodo(text)}
        />
        <TouchableOpacity onPress={() => handleAddTodo()}>
          <View style={styles.addTodo}>
            <Text style={styles.add}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8EAED",
  },

  todosWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },

  items: {
    marginTop: 30,
    marginBottom: 20,
  },

  addTodoWrapper: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 60,
    borderColor: "#C0C0C0",
    borderWidth: 1,
    width: 250,
  },
  addTodo: {
    width: 60,
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#C0C0C0",
    borderWidth: 1,
  },
  add: {},
});
export default Home;
