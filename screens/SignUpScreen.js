import React from "react";
import Firebase from "../firebase";
import {Image, Keyboard, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View} from "react-native";
import {Button} from "react-native-elements";

export default class SignInScreen extends React.Component {

    static navigationOptions = {
        headerShown: false
    };

    componentDidMount() {
    }

    onSignUp() {
        console.log('this might just be like Angular');
        // this.props.navigation.navigate('App');
        if (this.isEmailValid() === true) {
            console.log('good to go');
            this.setState({emailInvalid: false});
            console.log(this.state.email);
            console.log(this.state.password);
            Firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(data => {
                    console.log(data);
                    return Firebase.firestore().collection('users').doc(data.user.uid).set({
                        email: data.user.email,
                        name: `${this.state.firstName} ${this.state.lastName}`,
                    });
                    // return data.user.uid;
                    // return true;
                }).then(data => {
                console.log('looks like it signed up user');
                // return true;
                return this.props.navigation.navigate('App');
            })
                .catch(err => {
                    console.error();
                });


        } else {
            this.setState({emailInvalid: true});
            // this.state.emailInvalid = true;
        }
    }

    onSignIn = () => {
        // this.failedSignInMessage.bind(this, '');
        this.setState({failedSignIn: false});
        console.log('actually sign the mans in with firebase');

        if (this.isEmailValid() === true) {
            console.log('good to go');
            this.setState({emailInvalid: false});
            console.log(this.state.email);
            console.log(this.state.password);
            Firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(data => {
                    console.log(data);
                    console.log('looks like it signed in user');
                    // return true;
                    return this.props.navigation.navigate('App');
                })
                .catch(err => {
                    console.log('err below');
                    console.log(err);
                    this.setState({failedSignIn: true});
                    // console.error(err);
                });

        } else {
            this.setState({emailInvalid: true});
            // this.state.emailInvalid = true;
        }
    };

    signInPressed = () => {
        // const { navigation } = this.props;
        // this.props.navigation.navigate('SignIn');
        console.log('sign the mans in');
        console.log(this.state);
        this.setState({signUp: false});
    };

    signUpPressed = () => {
        this.setState({signUp: true});
    };

    backToSlotsPressed = () => {
        const { navigation } = this.props;
        this.props.navigation.navigate('App');
    };


    isEmailValid = () => {
        let email = this.state.email;
        let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        console.log(pattern.test(String(email).toLowerCase()));
        return pattern.test(String(email).toLowerCase());
    }

    emailMessage() {
        if (this.state.emailInvalid) {
            return <Text style={{fontSize: 15, color: 'red'}}> Please enter a valid email </Text>;
        } else {
            return <View></View>;
        }
    }

    failedSignInMessage = () => {
        if (this.state.failedSignIn) {
            return <Text style={{fontSize: 15, color: 'red'}}> Invalid email or password </Text>;
        } else {
            return <View></View>;
        }
    };

    state = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        emailInvalid: false,
        signUp: true,
        failedSignIn: false
    };

    render() {
        let display;
        if (this.state.signUp === true) {
            console.log('sign up is true');
            display =
                <View style={styles.container}>
                    <Image style={styles.logo} source={require('../assets/logo_transparent.png')}/>

                    <View style={styles.formContainer}>
                        <Text style={styles.mustSignUpText}>You must sign up to book slots</Text>
                    </View>
                    <Text></Text>

                    <View style={styles.formContainer}>
                        <View style={styles.nameInputContainer}>
                            <Text style={styles.labelText}>First Name</Text>
                            <TextInput
                                onChangeText={(firstName) => this.setState({firstName})}
                                value={this.state.firstName}
                                style={styles.nameInput}
                            />
                        </View>
                        <View style={styles.nameInputContainer}>
                            <Text style={styles.labelText}>Last Name</Text>
                            <TextInput
                                onChangeText={(lastName) => this.setState({lastName})}
                                value={this.state.lastName}
                                style={styles.nameInput}
                            />
                        </View>
                        <View style={styles.emailPasswordContainer}>
                            <Text style={styles.labelText}>Email</Text>
                            <TextInput
                                autoCapitalize={'none'}
                                onChangeText={(email) => {
                                    this.setState({email});
                                    this.isEmailValid();
                                }}
                                value={this.state.email}
                                style={styles.emailInput}
                            />
                        </View>
                        <View style={styles.emailPasswordContainer}>
                            <Text style={styles.labelText}>Password</Text>
                            <TextInput
                                onChangeText={(password) => this.setState({password})}
                                value={this.state.password}
                                secureTextEntry
                                textContentType={"newPassword"}
                                style={styles.emailInput}
                            />
                        </View>
                        <View style={styles.emailPasswordContainer}>{this.emailMessage()}</View>
                    </View>

                    <Text></Text>
                    {/*<View style={styles.emailPasswordContainer}>{this.emailMessage()}</View>*/}
                    <Button
                        title={"Sign up"}
                        onPress={() => {
                            this.onSignUp();
                        }}
                    />
                    <Text></Text>
                    <Text></Text>
                    <Text></Text>
                    <View style={styles.formContainer}>
                        <Text>Already have an account?
                            <Text style={{fontWeight: 'bold'}} onPress={this.signInPressed}> Sign in</Text>
                        </Text>
                    </View>
                    <Text></Text>
                    <View style={styles.formContainer}>

                        <Text>Want to view but not book? Click
                            <Text style={{textDecorationLine: 'underline'}} onPress={this.backToSlotsPressed}> here</Text>
                        </Text>
                    </View>
                </View>
            ;
        } else if (this.state.signUp === false) {
            console.log('sign up is false');
            display =
                <View style={styles.container}>
                    <Image style={styles.logo} source={require('../assets/logo_transparent.png')}/>

                    <View style={styles.formContainer}>
                        <Text style={styles.mustSignUpText}>You must sign in to book slots</Text>
                    </View>
                    <Text></Text>

                    <View style={styles.formContainer}>
                        <View style={styles.emailPasswordContainer}>
                            <Text style={styles.labelText}>Email</Text>
                            <TextInput
                                autoCapitalize={'none'}
                                onChangeText={(email) => {
                                    this.setState({email});
                                    this.isEmailValid();
                                }}
                                value={this.state.email}
                                style={styles.emailInput}
                            />
                        </View>
                        <View style={styles.emailPasswordContainer}>
                            <Text style={styles.labelText}>Password</Text>
                            <TextInput
                                onChangeText={(password) => this.setState({password})}
                                value={this.state.password}
                                textContentType={"password"}
                                secureTextEntry
                                style={styles.emailInput}
                            />
                        </View>
                        <View style={styles.emailPasswordContainer}>{this.emailMessage()}</View>
                    </View>

                    <Text></Text>
                        <View style={styles.emailPasswordContainer}>{this.failedSignInMessage()}</View>
                    {/*<View style={styles.emailPasswordContainer}>{this.emailMessage()}</View>*/}
                    <Button
                        title={"Sign in"}
                        onPress={() => {
                            this.onSignIn();
                        }}
                    />
                    <Text></Text>
                    <Text></Text>
                    <Text></Text>
                    <Text></Text>
                    <Text></Text>
                    <View style={styles.formContainer}>
                        <Text>Don't have an account?
                            <Text style={{fontWeight: 'bold'}} onPress={this.signUpPressed}> Sign Up</Text>
                        </Text>
                    </View>
                    <Text></Text>
                    <View style={styles.formContainer}>

                        <Text>Want to view but not book? Click
                            <Text style={{textDecorationLine: 'underline'}} onPress={this.backToSlotsPressed}> here</Text>
                        </Text>
                    </View>

                </View>;
        }

        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    Keyboard.dismiss();
                }}
            >
                {display}
            </TouchableWithoutFeedback>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 25,
        flex: 1,
        backgroundColor: "#F4991A",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    logo: {
        width: 170,
        height: 100
    },
    formContainer: {
        flexDirection: 'row',
        // backgroundColor: 'blue',
        width: '90%',
        flexWrap: 'wrap'
    },
    nameInputContainer: {
        width: '48%',
        marginRight: '2%',
        // backgroundColor: 'red'
    },
    nameInput: {
        backgroundColor: 'white',
        paddingVertical: '2%',
        marginTop: '6%',
        marginBottom: '5%'
    },
    emailPasswordContainer: {
        width: '98%',
        // backgroundColor: 'pink',
        marginRight: '2%'
    },
    emailInput: {
        backgroundColor: 'white',
        paddingVertical: '1%',
        marginTop: '3%',
        marginBottom: '2%'
    },
    labelText: {
        fontSize: 15
    },
    mustSignUpText: {
        fontSize: 15,
        paddingVertical: 1,
        fontWeight: 'bold'
    },
});
