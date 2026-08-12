import { Pressable, StyleSheet, Text, View } from "react-native";
import { CircleProgress } from "./circleProgress";
import { router } from "expo-router";

type LevelCardProps = {
    level: number;
};

export const LevelCard = ({ level }: LevelCardProps) => {
    return (
        <View style={styles.cardContainer}>
            <Pressable style={styles.cardPressable} onPress={() => router.replace("/(tabs)/question")}>
                <Text style={styles.cardText}>Level {level + 1}</Text>
                <CircleProgress size={50} strokeWidth={10} key={level} colour="black" progress={10}/>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        height: 90,
        borderTopWidth: 3,
        borderBottomWidth: 3,
        borderColor: 'black',
    },
    cardPressable: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',           // Vertically centers text & circle together
        justifyContent: 'space-between',// Spreads text to left and circle to right
        paddingHorizontal: 30,          // Space from screen edges
    },
    cardText: {
        fontSize: 23,
        fontWeight: 'bold',
    },
    cardProgress: {
        width: 50,
        height: 50,
        backgroundColor: 'green',
        borderRadius: 50,              // 10px radius makes a perfect circle for 20x20
        borderColor: 'black',
        borderWidth: 3,
    },
});