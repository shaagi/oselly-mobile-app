import React from "react";
import Firebase from "../firebase";
import {Image, StyleSheet, Text, View} from "react-native";

export default class AuthLoadingScreen extends React.Component {
    unsubscribe;

    componentDidMount() {
        this.unsubscribe = Firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log('is user new');
                this.props.navigation.navigate('App');
            } else {
                console.log('is not user new');
                this.props.navigation.navigate('Auth');
                // this.props.navigation.navigate('App');
            }
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.logo} source={require('../assets/logo_transparent.png')}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4991A",
        alignItems: "center",
        justifyContent: "center"
    },
    logo: {
        width: 220,
        height: 220
    },
});
