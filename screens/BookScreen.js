import React from "react";
import {Text, View} from "react-native";
import {Button} from "react-native-elements";
import moment from "moment";
import Firebase from "../firebase";

export default class BookScreen extends React.Component {

    state = {
        startTime: '',
        endTime: '',
        cost: 0,
        courtId: '',
        courtName: '',
        startTimeSeconds: '',
        endTimeSeconds: '',
        bookingIdFirestore: '',
        signedIn: false,
        processingRequest: false,
    };

    unsubscribe;

    componentDidMount() {
        this.unsubscribe = Firebase.auth().onAuthStateChanged((user) => {
            console.log('in authstatechanged');
            if (user) {
                this.setState({signedIn: true});
            } else {
                console.log('is not user new');
                this.setState({signedIn: false});
                // this.props.navigation.navigate('Auth');
                // this.props.navigation.navigate('App');
            }
        });

        const { navigation } = this.props;
        if (moment.unix(Number(JSON.stringify(navigation.getParam('start', 'none')))).format("MMMM D")
            === moment.unix(Number(JSON.stringify(navigation.getParam('end', 'none')))).format("MMMM D")
        ) {
            this.setState({
                startTime: moment.unix(Number(JSON.stringify(navigation.getParam('start', 'none'))))
                    .format("h:mmA"),
                endTime: moment.unix(Number(JSON.stringify(navigation.getParam('end', 'none'))))
                    .format("h:mmA, dddd, MMMM Do"),
            });
        } else {
            this.setState({
                startTime: moment.unix(Number(JSON.stringify(navigation.getParam('start', 'none'))))
                    .format("dddd, MMM Do, h:mmA"),
                endTime: moment.unix(Number(JSON.stringify(navigation.getParam('end', 'none'))))
                    .format("h:mmA, dddd, MMM Do"),
            });
        }

        if (this.props.navigation.state.params.duration === '2') {
            this.setState({cost: 90});
        } else if (this.props.navigation.state.params.duration === '1.5') {
            this.setState({cost: 70});
        } else if (this.props.navigation.state.params.duration === '1') {
            this.setState({cost: 50});
        }

        this.setState({
            courtId: (JSON.stringify(navigation.getParam('court', 'none'))).slice(1, -1),
            courtName: (JSON.stringify(navigation.getParam('courtName', 'none'))).slice(1, -1),
            startTimeSeconds: Number(JSON.stringify(navigation.getParam('start', 'none'))),
            endTimeSeconds: Number(JSON.stringify(navigation.getParam('end', 'none')))
        });
    }

    book = () => {
        this.setState({processingRequest: true});
        const { navigation } = this.props;
        console.log('book button pressed');
        console.log(this.state);
        console.log('diff: ');
        console.log(moment.unix(this.state.startTimeSeconds).diff(moment(), 'hours'));

        Firebase.firestore().collection('bookings').add({
            'oselly': true,
            'court': Firebase.firestore().doc(`/courts/${this.state.courtId}`),
            'time': {
                startTime: moment.unix(this.state.startTimeSeconds).toDate(),
                endTime: moment.unix(this.state.endTimeSeconds).toDate()
            },
        }).then(res => {
            return this.setState({bookingIdFirestore: res.id});
        }).then(res => {
            return Firebase.firestore().collection('bookings').doc(this.state.bookingIdFirestore)
                .collection('confirm-col').doc('confirmMessage').set({messageSent: false});
        }).then(res => {
            if (moment.unix(this.state.startTimeSeconds).diff(moment(), 'hours') > 30) {
                return Firebase.firestore().collection('bookings').doc(this.state.bookingIdFirestore)
                    .update({sendConfirmMessageByDate: moment.unix(this.state.startTimeSeconds).subtract(24, 'hours').toDate()});
                // return Firebase.firestore().collection('bookings').doc(this.state.bookingIdFirestore)
                //     .collection('confirm-col').doc('confirmMessage')
                //     .set({sendBy: moment.unix(this.state.startTimeSeconds).subtract(24, 'hours').toDate()});
            } else {
                return true;
            }
        }).then(res => {
            this.makeReservationOnPlanyo(this.state.bookingIdFirestore);
            console.log(Firebase.auth().currentUser.uid);
            return Firebase.firestore().collection('users').doc(Firebase.auth().currentUser.uid)
                .update({newBooking: this.state.bookingIdFirestore});
        }).then(res => {
            return Firebase.firestore().collection('users').doc(Firebase.auth().currentUser.uid).get();
        }).then(res => {
            if (res.data().bookings === undefined || res.data().bookings.length === 0) {
                return Firebase.firestore().collection('users').doc(Firebase.auth().currentUser.uid).update({
                    bookings: [res.data().newBooking]
                });
            } else {
                // const updatedBookings = res.data().bookings.push(res.data().newBooking);
                // return Firebase.firestore().collection('users').doc(Firebase.auth().currentUser.uid).update({
                //     bookings: updatedBookings
                // });
                console.log('b ookings below: ');
                console.log(res.data().bookings);
                const updatedBookings = [];
                let i;
                for (i in res.data().bookings) {
                    updatedBookings.push(res.data().bookings[i]);
                }
                updatedBookings.push(res.data().newBooking);
                console.log('updated bookings: ');
                console.log(updatedBookings);
                return Firebase.firestore().collection('users').doc(Firebase.auth().currentUser.uid).update({
                    bookings: updatedBookings
                });
            }
        }).then(data => {
            return this.setState({processingRequest: false});
        }).then(data => {
            return this.props.navigation.navigate('Home');
        }).then(data => {
            return this.props.navigation.navigate('Bookings');
        })
            .catch(err => {
            console.error(err);
        });
    };

    makeReservationOnPlanyo = (gameId) => {
        const makeRes = Firebase.functions().httpsCallable('makeReservationOnPlanyo');
        makeRes({
            startTimeSeconds: this.state.startTimeSeconds,
            endTimeSeconds: this.state.endTimeSeconds,
            courtName: this.state.courtName,
            gameId: gameId
        }).then(res => {
            console.log('res from cloud func: ');
            console.log(res);
            return true;
        }).catch(err => {
            console.error(err);
        });
    };

    signIn = () => {
        return this.props.navigation.navigate('SignUp');
    };

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        let bookButton;
        if (this.state.signedIn === false) {
            bookButton =
                <Button title={"Book"}
                        buttonStyle={{marginLeft: '7%', marginRight: '70%'}}
                        titleStyle={{paddingTop: 0, paddingBottom: 0}}
                        onPress={this.signIn}
                />
            ;
        } else if (this.state.signedIn && this.state.processingRequest === false) {
            bookButton =
                <Button title={"Book"}
                    buttonStyle={{marginLeft: '7%', marginRight: '70%'}}
                    titleStyle={{paddingTop: 0, paddingBottom: 0}}
                    onPress={this.book}
            />
            ;
        } else if (this.state.signedIn && this.state.processingRequest === true) {
            bookButton =
                <Button title={"processing your booking"}
                        buttonStyle={{marginLeft: '7%', marginRight: '50%'}}
                        titleStyle={{paddingTop: 0, paddingBottom: 0}}
                        disabled={true}
                />
            ;
        }

        return (
            <View>
                <Text></Text>
                <Text></Text>
                <Text style={{fontSize: 17, marginHorizontal: '8%', fontWeight: 'bold'}}>
                    {this.state.startTime} - {this.state.endTime}
                </Text>

                <Text style={{fontSize: 17, marginHorizontal: '8%', marginTop: '5%'}}>
                    {/*<Text style={{fontWeight: 'bold'}}>Cost: $90 </Text>*/}
                    <Text style={{fontWeight: 'bold'}}>Cost: ${this.state.cost} </Text>
                    - Payment will be split via interac machine after we play</Text>

                <Text style={{fontSize: 17, marginHorizontal: '8%', marginTop: '5%', color: 'grey',}}>
                    Benchmark Sports, 284 Orenda Rd, Brampton, L7C3P2
                </Text>
                <View style={{marginTop: '6%'}}>
                    {bookButton}
                    {/*<Button title={"Book"}*/}
                    {/*        buttonStyle={{marginLeft: '7%', marginRight: '70%'}}*/}
                    {/*        titleStyle={{paddingTop: 0, paddingBottom: 0}}*/}
                    {/*        onPress={this.book}*/}
                    {/*/>*/}

                    <Text></Text>
                    <Text></Text>
                </View>
            </View>
        );
    }
}
