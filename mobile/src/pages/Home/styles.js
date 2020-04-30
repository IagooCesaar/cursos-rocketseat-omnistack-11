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

  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    maxHeight: 400,
  },

  logo: {},

  heroesLogo: {
    height: 300,
    alignSelf: "stretch",
    width: "auto",
  },

  apresentation: {
    marginTop: 30,
  },

  apresentationText: {
    fontSize: 15,
    color: "#737380",
  },

  apresentationTextBold: {
    fontWeight: "bold",
  },

  actionsContainer: {
    marginTop: 30,
    flex: 1,
    flexDirection: "column",
  },

  action: {
    backgroundColor: "#e02041",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  secundaryAction: {
    backgroundColor: "#737380",
  },

  actionText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});
