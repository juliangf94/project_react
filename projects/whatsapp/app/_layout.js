import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { ChatWrapper } from "../components/ChatWrapper";
import { AppProvider } from "../contexts/AppContext";

export default function Layout() {
    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={styles.container}>
                <ChatWrapper>
                    <AppProvider>
                        <Stack />
                    </AppProvider>
                </ChatWrapper>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});