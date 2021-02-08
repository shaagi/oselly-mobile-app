import React from "react";
import {ScrollView, Text, View} from "react-native";
import Firebase from "../firebase";
import Booking from "../components/booking";

export default class NotifsScreen extends React.Component {

    state = {
        signedIn: false
    };

    unsubscribe;

    componentDidMount() {
        this.unsubscribe = Firebase.auth().onAuthStateChanged((user) => {
            console.log('in authstatechanged');
            if (user) {
                this.setState({signedIn: true});
            } else {
                console.log('is not user new myBookings');
                this.setState({signedIn: false});
                // this.props.navigation.navigate('Auth');
                // this.props.navigation.navigate('App');
            }
        });
    }

    componentWillUnmount() {
        console.log('unmounted myNotifs');
        this.unsubscribe();
    }

    render() {
        let display;
        if (this.state.signedIn === false) {
            display =
                <View style={{backgroundColor: 'grey', borderRadius: 5, marginLeft: '3%', marginRight: '25%',
                    marginTop: '2%'}}>
                    <Text style={{padding: '2%', fontSize: 16}}>
                        Please sign in to get useful notifications about your bookings
                    </Text>
                </View>
            ;
        } else if (this.state.signedIn) {
            display =
                <View style={{backgroundColor: 'grey', borderRadius: 5, marginLeft: '3%', marginRight: '25%', marginTop: '2%'}}>
                    <Text style={{padding: '2%', fontSize: 16}}>
                        You'll get a text from Oselly (6477215266) a day before your booking to
                        confirm if you'll still be attending or not. This feature will be here soon.
                    </Text>
                </View>;
        }

        return (
            <View>
                {display}
                {/*<View style={{alignItems: 'center'}}>*/}
                {/*    <Text style={{color: 'grey', marginVertical: '2%'}}>Wednesday, Nov 20th</Text>*/}
                {/*</View>*/}
                <View style={{backgroundColor: 'grey', borderRadius: 5, marginLeft: '3%', marginRight: '25%',
                    marginTop: '2%'}}>
                    <Text style={{padding: '2%', fontSize: 16}}>
                        If you need any help at all please feel free to call/text us at 6477215266 or email swagatsoni6@gmail.com
                    </Text>
                </View>
                {/*<Text style={{marginLeft: '3%', color: 'grey', fontSize: 12, marginVertical: '1%'}}>2:53pm</Text>*/}

                {/*<View style={{backgroundColor: 'grey', borderRadius: 5, marginLeft: '3%', marginRight: '25%',*/}
                {/*    marginTop: '2%'}}>*/}
                {/*    <Text style={{padding: '2%', fontSize: 16}}>*/}
                {/*        Thanks, your booking has been confirmed*/}
                {/*    </Text>*/}
                {/*</View>*/}
                {/*<Text style={{marginLeft: '3%', color: 'grey', fontSize: 12, marginVertical: '1%'}}>2:54pm</Text>*/}

                {/*<View style={{alignItems: 'center'}}>*/}
                {/*    <Text style={{color: 'grey', marginVertical: '2%'}}>Wednesday, Nov 20th</Text>*/}
                {/*</View>*/}
                {/*<View style={{backgroundColor: 'grey', borderRadius: 5, marginLeft: '3%', marginRight: '25%',*/}
                {/*    marginTop: '2%'}}>*/}
                {/*    <Text style={{padding: '2%', fontSize: 16}}>*/}
                {/*        Your booking tomorrow at 11:00PM - 12:00AM at Benchmark Sports,*/}
                {/*        can you still make it? Press <Text style={{color: 'blue', textDecorationLine: 'underline'}}>*/}
                {/*        Yes </Text>to confirm, <Text style={{color: 'blue', textDecorationLine: 'underline'}}>no </Text>*/}
                {/*        to cancel*/}
                {/*    </Text>*/}
                {/*</View>*/}
                {/*<Text style={{marginLeft: '3%', color: 'grey', fontSize: 12, marginVertical: '1%'}}>2:53pm</Text>*/}

                {/*<View style={{backgroundColor: 'grey', borderRadius: 5, marginLeft: '3%', marginRight: '25%',*/}
                {/*    marginTop: '2%'}}>*/}
                {/*    <Text style={{padding: '2%', fontSize: 16}}>*/}
                {/*        Thanks, your booking has been confirmed*/}
                {/*    </Text>*/}
                {/*</View>*/}
                {/*<Text style={{marginLeft: '3%', color: 'grey', fontSize: 12, marginVertical: '1%'}}>2:54pm</Text>*/}

            </View>
        );
    }
}
