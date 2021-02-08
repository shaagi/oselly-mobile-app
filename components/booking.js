import React from "react";
import {ScrollView, Text, View} from "react-native";
import {Button, Divider, Tooltip} from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';
import Firebase from "../firebase";
import moment from "moment";
import environment from '../environment';

export default class Booking extends React.Component {
    bookingId;

    state = {
        startTimeSeconds: 0,
        endTimeSeconds: 0,
        courtName: '',
        startTime: '',
        endTime: '',
        processingRequest: false,
    };

    componentDidMount() {
        console.log(this.props.bookingId);
        Firebase.firestore().collection('bookings').doc(this.props.bookingId).get()
            .then(bookingDocSnapshot => {
                console.log('bookingDocSNapshot stuff: ');
                console.log(bookingDocSnapshot.data());
                if (environment.env === 'prod') {
                    if (bookingDocSnapshot.data().court.id.charAt(0) === 'K') {
                        this.setState({courtName: 'Court #2'})
                    } else if (bookingDocSnapshot.data().court.id.charAt(0) === 'Q') {
                        this.setState({courtName: 'Court #1'})
                    }
                } else if (environment.env === 'dev') {
                    if (bookingDocSnapshot.data().court.id.charAt(0) === 'y') {
                        this.setState({courtName: 'Court #1'})
                    } else if (bookingDocSnapshot.data().court.id.charAt(0) === 'N') {
                        this.setState({courtName: 'Court #2'})
                    }
                }
                if (moment.unix(bookingDocSnapshot.data().time.startTime.seconds).format("MMMM D")
                    === moment.unix(bookingDocSnapshot.data().time.endTime.seconds).format("MMMM D")
                ) {
                    this.setState({
                        startTime: moment.unix(bookingDocSnapshot.data().time.startTime.seconds)
                            .format("h:mmA"),
                        endTime: moment.unix(bookingDocSnapshot.data().time.endTime.seconds)
                            .format("h:mmA, dddd, MMMM Do"),
                    });
                } else {
                    this.setState({
                        startTime: moment.unix(bookingDocSnapshot.data().time.startTime.seconds)
                            .format("dddd, MMM Do, h:mmA"),
                        endTime: moment.unix(bookingDocSnapshot.data().time.endTime.seconds)
                            .format("h:mmA, dddd, MMM Do"),
                    });
                }
                return true;
            })
            .catch(err => {
                console.error(err);
            });
    }

    cancel = () => {
        this.setState({processingRequest: true});
        Firebase.firestore().collection('bookings').doc(this.props.bookingId).get()
            .then(res => {
                console.log('res: ');
                console.log(res);
                return this.cancelReservationOnPlanyo(this.props.bookingId, Firebase.auth().currentUser.uid);
            }).catch(err => {
                console.error(err);
            });
    };

    cancelReservationOnPlanyo = (bookingId, uid) => {
        const cancelRes = Firebase.functions().httpsCallable('cancelBookingOnPlanyo');
        cancelRes({
            bookingId: bookingId,
            uid: uid
        }).then(res => {
            console.log('res from cloud func: ');
            console.log(res);
            return this.setState({processingRequest: false});
        }).catch(err => {
            console.error(err);
        });
    };

    render() {
        let cancelButton;
        if (this.state.processingRequest === false) {
            cancelButton =
                <Button title={"Cancel"}
                        buttonStyle={{backgroundColor: 'red', width: '65%'}}
                        titleStyle={{paddingTop: 0, paddingBottom: 0}}
                        onPress={this.cancel}
                />
            ;
        } else if (this.state.processingRequest === true) {
            cancelButton =
                <Button title={"processing your cancellation"}
                        buttonStyle={{backgroundColor: 'red', width: '65%'}}
                        titleStyle={{paddingTop: 0, paddingBottom: 0}}
                        disabled={true}
                />
            ;
        }

        return (
            <View>
                <Text></Text>
                <Divider style={{ backgroundColor: 'grey', marginHorizontal: '5%'}} />
                <Text></Text>
                <Text style={{fontSize: 17, marginHorizontal: '8%', fontWeight: 'bold'}}>
                    {/*11:00PM - 12:00AM, Thursday November 21st*/}
                    {this.state.startTime} - {this.state.endTime}
                </Text>

                <Text style={{fontSize: 17, marginHorizontal: '8%', marginTop: '5%',}}>
                    {this.state.courtName}
                </Text>

                <Text style={{fontSize: 17, marginHorizontal: '8%', marginTop: '5%', color: 'grey',}}>
                    Benchmark Sports, 284 Orenda Rd, Brampton, L7C3P2
                </Text>
                <Tooltip popover={<Text>Payment will be split via
                    interac machine after we play</Text>}
                         withPointer={false}
                         height={55}
                         width={210}
                >

                    <View style={{marginHorizontal: '8%', marginTop: '5%'}}>
                        <Icon
                            name='plus-circle'
                            size={25}/>
                    </View>

                </Tooltip>
                <View style={{marginTop: '6%', marginLeft: '7%'}}>
                    <View style={{flexDirection: 'row'}}>
                        {cancelButton}
                        {/*<Button title={"Cancel"}*/}
                        {/*        buttonStyle={{backgroundColor: 'red', width: '65%'}}*/}
                        {/*        titleStyle={{paddingTop: 0, paddingBottom: 0}}*/}
                        {/*        onPress={this.cancel}*/}
                        {/*/>*/}
                    </View>


                    <Text></Text>
                    <Text></Text>
                </View>
                <Divider style={{ backgroundColor: 'grey', marginHorizontal: '5%'}} />
                <Text></Text>
            </View>
        );
    }
}
