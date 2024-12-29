import React from "react";
import { Navigation } from "./src/navigation";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, paddingTop: 0 }}>
        <Navigation />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
