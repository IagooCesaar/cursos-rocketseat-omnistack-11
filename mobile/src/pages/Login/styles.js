import React from "react";
import { StyleSheet, NativeModules } from "react-native";
import Constants from "expo-constants";

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Constants.statusBarHeight + 20,
    backgroundColor: "#f0f0f5",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#737380",
  },

  title: {
    fontSize: 30,
    marginBottom: 16,
    marginBottom: 16,
    color: "#13131a",
    fontWeight: "bold",
  },

  input: {
    height: 46,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginTop: 20,
    paddingHorizontal: 15,
  },

  action: {
    backgroundColor: "#e02041",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  actionText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },

  actionLink: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  actionLinkText: {
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 15,
    color: "#737380",
  },
});
