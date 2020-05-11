import React from "react";
import { StyleSheet, NativeModules } from "react-native";
import Constants from "expo-constants";
export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Constants.statusBarHeight + 20,
    marginBottom: 10,
    backgroundColor: "#f0f0f5",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerText: {
    fontSize: 15,
    color: "#737380",
  },

  headerTextBold: {
    fontWeight: "bold",
  },

  title: {
    fontSize: 30,
    marginBottom: 16,
    marginBottom: 16,
    color: "#13131a",
    fontWeight: "bold",
  },

  incident: {
    padding: 24,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 16,
    marginTop: 32,
  },

  incidentProperty: {
    fontSize: 14,
    color: "#41414d",
    fontWeight: "bold",
    marginTop: 24,
  },

  incidentValue: {
    marginTop: 8,
    fontSize: 15,
    color: "#737380",
  },

  contactBox: {
    padding: 24,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 16,
    marginTop: 32,
  },

  heroTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#13131a",
    lineHeight: 30,
  },

  heroDescription: {
    fontSize: 15,
    color: "#737380",
    marginTop: 16,
  },

  multipleActions: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  multipleAction: {
    backgroundColor: "#e02041",
    borderRadius: 8,
    height: 50,
    width: "48%",
    justifyContent: "center",
    alignItems: "center",
  },

  actions: {
    marginTop: 16,
  },

  action: {
    backgroundColor: "#e02041",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  actionText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },

  input: {
    minHeight: 46,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: 4,
    marginBottom: 20,
    paddingHorizontal: 15,
  },

  inputGroup: {
    flex: 2,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
