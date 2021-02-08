import React from "react";
import {ScrollView, Text, View} from "react-native";
import Booking from "../components/booking";
import Firebase from "../firebase";
import * as Amplitude from 'expo-analytics-amplitude';

export default class MyBookingsScreen extends React.Component {

    state = {
        bookingIds: [],
        signedIn: false
    };

    unsubUsersBookings;
    unsubscribe;

    static navigationOptions = () => {
        return ({
            tabBarOnPress: ({navigation, defaultHandler}) => {
                console.log('clicked');

                // this.handler();
                defaultHandler();
            }
        });
    };


    componentDidMount() {
        console.log('MYBOOKINGS MOUNTED');
        this.unsubscribe = Firebase.auth().onAuthStateChanged((user) => {
            console.log('in authstatechanged mybookings');

            if (user) {
                this.setState({signedIn: true});
                this.unsubUsersBookings = Firebase.firestore().collection('users').doc(Firebase.auth().currentUser.uid)
                    .onSnapshot(docSnapshot => {
                        console.log('stuff: ');
                        console.log(docSnapshot.data());
                        this.setState({bookingIds: docSnapshot.data().bookings});
                    }, err => {
                        console.error(err);
                    });

                // const userObj = user;
                Amplitude.setUserId(user.uid).then(res => {
                    return Amplitude.setUserProperties({email: user.email});
                }).catch(err => {
                    console.error(err);
                });
            } else {
                console.log('is not user new myBookings');
                this.setState({signedIn: false});
                // this.props.navigation.navigate('Auth');
                // this.props.navigation.navigate('App');
            }
        });

        // console.log(Firebase.auth().currentUser);
        // if (Firebase.auth().currentUser === null) {
        //     console.log('its undefined');
        // } else {
        //     this.unsubUsersBookings = Firebase.firestore().collection('users').doc(Firebase.auth().currentUser.uid)
        //         .onSnapshot(docSnapshot => {
        //             console.log('stuff: ');
        //             console.log(docSnapshot.data());
        //             this.setState({bookingIds: docSnapshot.data().bookings});
        //         }, err => {
        //             console.error(err);
        //         });
        // }

    }

    componentWillUnmount() {
        console.log('unmounted myBookings');
        if (this.unsubUsersBookings !== undefined) {
            this.unsubUsersBookings();
        }
        this.unsubscribe();
    }

    render() {
        let display;
        if (this.state.signedIn === false) {
            display =
                <View style={{justifyContent: 'center', alignItems: 'center', textAlign: 'left'}}>
                    <Text style={{padding: '15%', fontSize: 16}}>
                        please sign in to view your bookings
                    </Text>
                </View>;
        } else if (this.state.bookingIds === undefined || this.state.bookingIds.length === 0) {
            display =
                <View style={{justifyContent: 'center', alignItems: 'center', textAlign: 'left'}}>
                    <Text style={{padding: '15%', fontSize: 16}}>
                        you don't have any upcoming bookings. Vacancies that you book will show up here
                    </Text>
                </View>;
        } else {
            display = <ScrollView>
                {
                    this.state.bookingIds.map((bookingIds) => (
                        <Booking key={bookingIds} bookingId={bookingIds} />
                    ))
                }
            </ScrollView>;
        }

        return (
            <View>
                {display}
            </View>
        );
    }

    // static handler() {
    //     Amplitude.logEvent('toBookings')
    //         .then(res => {console.log('worked')})
    //         .catch(err => console.error(err));
    // }
}
