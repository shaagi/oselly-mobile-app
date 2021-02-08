import React from "react";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import {Button, ListItem} from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from "moment";
import 'moment-timezone';
import Firebase from "../firebase";
import {Analytics, PageHit, ScreenHit} from 'expo-analytics';
import * as Amplitude from 'expo-analytics-amplitude';
import environment from "../environment";



export default class VacanciesScreen extends React.Component {

    static navigationOptions = {
        headerShown: false
    };

    state = {
        selectedDateMoment: moment().add(1, 'hour').startOf('hour'), //moment(),
        selectedMonth: moment().format('MMMM'),
        day1: moment().format('ddd'),
        day2: moment().add(1, 'days').format('ddd'),
        day3: moment().add(2, 'days').format('ddd'),
        day4: moment().add(3, 'days').format('ddd'),
        date1: moment().format('D'),
        date2: moment().add(1, 'days').format('D'),
        date3: moment().add(2, 'days').format('D'),
        date4: moment().add(3, 'days').format('D'),
        selectedDate: 'date1',
        selectedDuration: '1',
        vacantSlots: [],
        firestoreSlots: [],
        inPast: false,
        headedToPastDayDate: true,
        headedToPastMonth: true
    };

    toggleMonth = (direction) => {
        Amplitude.logEvent('toggleMonth' + direction)
            .then(res => {return true;})
            .catch(err => console.error(err));
        this.unsub();
        if (direction === 'right') {
            this.setState({
                selectedDateMoment: moment(this.state.selectedDateMoment).add(1, 'months')
                    .startOf('month'),
                selectedMonth: moment(this.state.selectedDateMoment).add(1, 'months')
                    .format('MMMM'),
                selectedDate: 'date1',
                day1: moment(this.state.selectedDateMoment).add(1, 'months').startOf('month')
                    .format('ddd'),
                day2: moment(this.state.selectedDateMoment).add(1, 'months').startOf('month')
                    .add(1, 'days').format('ddd'),
                day3: moment(this.state.selectedDateMoment).add(1, 'months').startOf('month')
                    .add(2, 'days').format('ddd'),
                day4: moment(this.state.selectedDateMoment).add(1, 'months').startOf('month')
                    .add(3, 'days').format('ddd'),
                date1: moment(this.state.selectedDateMoment).add(1, 'months').startOf('month')
                    .format('D'),
                date2: moment(this.state.selectedDateMoment).add(1, 'months').startOf('month')
                    .add(1, 'days').format('D'),
                date3: moment(this.state.selectedDateMoment).add(1, 'months').startOf('month')
                    .add(2, 'days').format('D'),
                date4: moment(this.state.selectedDateMoment).add(1, 'months').startOf('month')
                    .add(3, 'days').format('D'),
            }, () => {
                // console.log(this.state.selectedDateMoment);
                this.setState({
                    inPast: moment(this.state.selectedDateMoment).isBefore(moment().startOf('day')),
                    headedToPastDayDate: moment(this.state.selectedDateMoment).subtract(4, 'days')
                        .isBefore(moment().subtract(4, 'days').startOf('day')),
                    headedToPastMonth: moment(this.state.selectedDateMoment).subtract(1, 'months')
                        .endOf('month').subtract(3, 'days').isBefore(moment().startOf('day'))
                });
                const startOfDay = moment(this.state.selectedDateMoment).toDate();
                const startOfNextDay = moment(this.state.selectedDateMoment).add(1, 'days').toDate();
                if (this.state.selectedDateMoment.format('MMM D YYYY') === moment().format('MMM D YYYY')) {
                    // is today
                    const earliestStart = moment().add(1, 'hour').startOf('hour').toDate();
                    this.getBookingsTriggerGenerateSlots(earliestStart, startOfNextDay, this.state.selectedDuration);
                } else {
                    this.getBookingsTriggerGenerateSlots(startOfDay, startOfNextDay, this.state.selectedDuration);
                }
            });
        } else if (direction === 'left') {
            this.setState({
                selectedDateMoment: moment(this.state.selectedDateMoment).subtract(1, 'months')
                    .endOf('month').subtract(3, 'days'),
                selectedMonth: moment(this.state.selectedDateMoment).subtract(1, 'months')
                    .format('MMMM'),
                selectedDate: 'date1',
                day1: moment(this.state.selectedDateMoment).subtract(1, 'months').endOf('month')
                    .subtract(3, 'days').format('ddd'),
                day2: moment(this.state.selectedDateMoment).subtract(1, 'months').endOf('month')
                    .subtract(2, 'days').format('ddd'),
                day3: moment(this.state.selectedDateMoment).subtract(1, 'months').endOf('month')
                    .subtract(1, 'days').format('ddd'),
                day4: moment(this.state.selectedDateMoment).subtract(1, 'months').endOf('month')
                    .format('ddd'),
                date1: moment(this.state.selectedDateMoment).subtract(1, 'months').endOf('month')
                    .subtract(3, 'days').format('D'),
                date2: moment(this.state.selectedDateMoment).subtract(1, 'months').endOf('month')
                    .subtract(2, 'days').format('D'),
                date3: moment(this.state.selectedDateMoment).subtract(1, 'months').endOf('month')
                    .subtract(1, 'days').format('D'),
                date4: moment(this.state.selectedDateMoment).subtract(1, 'months').endOf('month')
                    .format('D'),
            }, () => {
                console.log(this.state.selectedDateMoment);
                this.setState({
                    inPast: moment(this.state.selectedDateMoment).isBefore(moment().startOf('day')),
                    headedToPastDayDate: moment(this.state.selectedDateMoment).subtract(4, 'days')
                        .isBefore(moment().subtract(4, 'days').startOf('day')),
                    headedToPastMonth: moment(this.state.selectedDateMoment).subtract(1, 'months')
                        .endOf('month').subtract(3, 'days').isBefore(moment().startOf('day'))
                });
                const endOfDay = moment(this.state.selectedDateMoment).toDate();
                const startOfDay = moment(this.state.selectedDateMoment).startOf('day').toDate();
                if (this.state.selectedDateMoment.format('MMM D YYYY') === moment().format('MMM D YYYY')) {
                    // is today
                    const earliestStart = moment().add(1, 'hour').startOf('hour').toDate();
                    this.getBookingsTriggerGenerateSlots(earliestStart, endOfDay, this.state.selectedDuration);
                } else {
                    this.getBookingsTriggerGenerateSlots(startOfDay, endOfDay, this.state.selectedDuration);
                }
            });
        }
    };

    toggleDayDate = (direction) => {
        Amplitude.logEvent('toggleDayDate' + direction)
            .then(res => {return true;})
            .catch(err => console.error(err));
        this.unsub();
        if (direction === 'right') {
            console.log('time0: ');
            console.log(new Date());
            this.setState({
                selectedDateMoment: moment(this.state.selectedDateMoment).add(4, 'days'),
                selectedMonth: moment(this.state.selectedDateMoment).add(4, 'days').format('MMMM'),
                day1: moment(this.state.selectedDateMoment).add(4, 'days').format('ddd'),
                day2: moment(this.state.selectedDateMoment).add(5, 'days').format('ddd'),
                day3: moment(this.state.selectedDateMoment).add(6, 'days').format('ddd'),
                day4: moment(this.state.selectedDateMoment).add(7, 'days').format('ddd'),
                date1: moment(this.state.selectedDateMoment).add(4, 'days').format('D'),
                date2: moment(this.state.selectedDateMoment).add(5, 'days').format('D'),
                date3: moment(this.state.selectedDateMoment).add(6, 'days').format('D'),
                date4: moment(this.state.selectedDateMoment).add(7, 'days').format('D'),
            }, () => {
                this.updateStateAndGenerateSlotsForToggleDayDate();
            });
        } else if (direction === 'left') {
            this.setState({
                selectedDateMoment: moment(this.state.selectedDateMoment).subtract(4, 'days'),
                selectedMonth: moment(this.state.selectedDateMoment).subtract(4, 'days')
                    .format('MMMM'),
                day1: moment(this.state.selectedDateMoment).subtract(4, 'days').format('ddd'),
                day2: moment(this.state.selectedDateMoment).subtract(3, 'days').format('ddd'),
                day3: moment(this.state.selectedDateMoment).subtract(2, 'days').format('ddd'),
                day4: moment(this.state.selectedDateMoment).subtract(1, 'days').format('ddd'),
                date1: moment(this.state.selectedDateMoment).subtract(4, 'days').format('D'),
                date2: moment(this.state.selectedDateMoment).subtract(3, 'days').format('D'),
                date3: moment(this.state.selectedDateMoment).subtract(2, 'days').format('D'),
                date4: moment(this.state.selectedDateMoment).subtract(1, 'days').format('D'),
            }, () => {
                this.updateStateAndGenerateSlotsForToggleDayDate();
            });
        }
    };

    updateStateAndGenerateSlotsForToggleDayDate = () => {
        console.log('time1: ');
        console.log(new Date());
        this.setState({
            inPast: moment(this.state.selectedDateMoment).isBefore(moment().startOf('day')),
            headedToPastDayDate: moment(this.state.selectedDateMoment).subtract(4, 'days')
                .isBefore(moment().subtract(4, 'days').startOf('day')),
            headedToPastMonth: moment(this.state.selectedDateMoment).subtract(1, 'months')
                .endOf('month').subtract(3, 'days').isBefore(moment().startOf('day'))
        });
        if (moment(this.state.selectedDateMoment).format('D') === this.state.date1) {
            this.setState({selectedDate: 'date1'});
        } else if (moment(this.state.selectedDateMoment).format('D') === this.state.date2) {
            this.setState({selectedDate: 'date2'});
        } else if (moment(this.state.selectedDateMoment).format('D') === this.state.date3) {
            this.setState({selectedDate: 'date3'});
        } else if (moment(this.state.selectedDateMoment).format('D') === this.state.date4) {
            this.setState({selectedDate: 'date4'});
        }
        const startOfDay = moment(this.state.selectedDateMoment).startOf('day').toDate();
        const startOfNextDay = moment(this.state.selectedDateMoment).add(1, 'days').startOf('day').toDate();
        if (this.state.selectedDateMoment.format('MMM D YYYY') === moment().format('MMM D YYYY')) {
            // is today
            const earliestStart = moment().add(1, 'hour').startOf('hour').toDate();
            this.getBookingsTriggerGenerateSlots(earliestStart, startOfNextDay, this.state.selectedDuration);
        } else {
            console.log('time2: ');
            console.log(new Date());
            this.getBookingsTriggerGenerateSlots(startOfDay, startOfNextDay, this.state.selectedDuration);
        }
        if (
            this.state.selectedMonth !== moment(this.state.selectedDateMoment).add(3, 'days')
                .format('MMMM')
        ) {
            this.setState({
                selectedMonth: `${this.state.selectedMonth}-${moment(this.state.selectedDateMoment)
                    .add(3, 'days').format('MMMM')}`
            });
        }
    };

    changeSelectedDate = (newDate) => {
        Amplitude.logEvent('changeSelectedDate' + newDate)
            .then(res => {return true;})
            .catch(err => console.error(err));

        this.unsub();
        const prevDateInt = Number(this.state.selectedDate.charAt(4));
        const newDateInt = Number(newDate.charAt(4));
        const diff = newDateInt - prevDateInt;

        if (diff < 0) {
            const startOfDay = moment(this.state.selectedDateMoment).subtract((diff*(-1)), 'days').startOf('day');
            this.updateStateAndGenerateSlotsForChangeSelectedDate(newDate, startOfDay);
        } else {
            const startOfDay = moment(this.state.selectedDateMoment).add(diff, 'days').startOf('day');
            this.updateStateAndGenerateSlotsForChangeSelectedDate(newDate, startOfDay);
        }
    };

    updateStateAndGenerateSlotsForChangeSelectedDate = (newDate, startOfDay) => {
        this.setState({
            selectedDate: newDate,
            selectedDateMoment: startOfDay
        }, () => {
            this.setState({inPast: moment(this.state.selectedDateMoment).isBefore(moment().startOf('day'))});
            const startOfNextDay = moment(startOfDay).add(1, 'days');
            if (this.state.selectedDateMoment.format('MMM D YYYY') === moment().format('MMM D YYYY')) {
                // is today
                const earliestStart = moment().add(1, 'hour').startOf('hour');
                this.getBookingsTriggerGenerateSlots(earliestStart.toDate(), startOfNextDay.toDate(),
                    this.state.selectedDuration);
            } else {
                this.getBookingsTriggerGenerateSlots(startOfDay.toDate(), startOfNextDay.toDate(),
                    this.state.selectedDuration);
            }
        });
    };

    changeSelectedDuration = (newDuration) => {
        Amplitude.logEvent('changeDurationTo' + newDuration)
            .then(res => {return true;})
            .catch(err => console.error(err));
        this.setState({selectedDuration: newDuration}, () => {
            // this.changeSelectedDate(this.state.selectedDate, true);
            console.log(this.state.selectedDateMoment);
            if (this.state.selectedDateMoment.format('MMM D YYYY') === moment().format('MMM D YYYY')) {
                // is today
                const earliestStart = moment().add(1, 'hour').startOf('hour');
                this.generateSlots(moment(earliestStart).toDate(), this.state.selectedDuration);
            } else {
                this.generateSlots(moment(this.state.selectedDateMoment).toDate(), this.state.selectedDuration);
            }
        });
    };

    componentDidMount() {

        Amplitude.initialize(environment.amplitudeApiKey)
            .then(() => console.log("initialized ampl"))
            .catch(e => console.error(e.message));

        this.analytics.hit(new PageHit('Standard'))
            .then(() => console.log("page hit"))
            .catch(e => console.error(e.message)); // didnt feel like investing the time to figure out how to create
        // separation because myBookings and Vacancies and notifs mount all at the same time, so if i'm sending info to
        // google analytics I have to do it in a way that the info gets sent when the user starts their session on a screen
        // and ends their session on said screen, but rn all i can pull off is telling google analytics when the app opened
        // and when it closed since almost everything mounts all at once and my best idea as of now is to put analytics.hit
        // in compoenentdidmount. Also didnt feel like investing the time to send GA data on WHO the user is as i can just do
        // it on amplitude and then guess, which will be good enough analytics for launch


        let earliestStart = moment().add(1, 'hour').startOf('hour');
        let endOfDay = moment().endOf('day');
        console.log('component did mount');
        this.getBookingsTriggerGenerateSlots(earliestStart.toDate(), endOfDay.toDate(), this.state.selectedDuration);

    }

    analytics = new Analytics('UA-132341142-3');

    unsub;

    getBookingsTriggerGenerateSlots = (time1, time2, selectedDuration) => { // this reacts in realtime which is why its still here
        console.log('time3: ');
        console.log(new Date());
        console.log(time1);
        this.unsub = Firebase.firestore().collection('bookings')
            .where(`time.startTime`, '>=', time1)
            .where('time.startTime', '<', time2)
            .onSnapshot(querySnapshot => {
                console.log(querySnapshot.docs);
                console.log('in get Bookings');
                console.log('time4: '); // time3 to time4 took 6 seconds on toggleDayDateRight
                console.log(new Date());

                let firestoreSlots = [];
                let i;
                for (i in querySnapshot.docs) {
                    console.log(querySnapshot.docs[i].data());
                    // console.log(moment.unix(Number(querySnapshot.docs[i].data().time.startTime.seconds)));
                    firestoreSlots.push({
                        startTime: moment.unix(Number(querySnapshot.docs[i].data().time.startTime.seconds)),
                        endTime: moment.unix(Number(querySnapshot.docs[i].data().time.endTime.seconds)),
                        courtRef: querySnapshot.docs[i].data().court
                    });
                }
                console.log('time5: '); // time4 to time5 took 9 seconds on toggleDayDateRight
                console.log(new Date());
                this.setState({
                    firestoreSlots: firestoreSlots
                }, () => {
                    this.generateSlots(time1, selectedDuration);
                });

            }, err => {
                console.log(`error: ${err}`);
            });
    };

    generateSlots(time1, selectedDuration) {
        console.log('time6: ');
        console.log(new Date());
        Firebase.firestore().collection('courts').get().then(querySnapshot => {
            let closedSlotsAndRawSlots = [];
            let i;
            for (i in querySnapshot.docs) {
                let rawSlots = [];
                let slotsStartTime = moment(time1);
                let slotEndTime = moment(time1).add(Number(selectedDuration), 'hours');
                while (slotsStartTime.isBefore(moment(time1).endOf('day')) === true) {
                    rawSlots.push({
                        name: `${slotsStartTime.format('h:mmA')} - ${slotEndTime.format('h:mmA')}`,
                        subtitle: 'Benchmark Sports',
                        startTimeMoment: slotsStartTime,
                        endTimeMoment: slotEndTime,
                        courtRef: querySnapshot.docs[i].ref,
                        courtName: querySnapshot.docs[i].data().courtName,
                        gymName: querySnapshot.docs[i].data().gymName
                    });
                    slotsStartTime = moment(slotsStartTime).add(30, 'minutes');
                    slotEndTime = moment(slotEndTime).add(30, 'minutes');
                }
                const closedSlot = [{
                    startTime: moment(time1).startOf('day').add(2, 'hours'),
                    endTime: moment(time1).startOf('day').add(7, 'hours'),
                }];
                // return {rawSlots, closedSlot};
                closedSlotsAndRawSlots.push({rawSlots, closedSlot});
            }
            return closedSlotsAndRawSlots;
        }).then(closedSlotsAndRawSlots => {
            const courtArrayOfSlotsArrays = [];
            let i;
            let j;
            let k;

            for (i in closedSlotsAndRawSlots) {
                const closedTimeBlocks = closedSlotsAndRawSlots[i].closedSlot;
                const eliminatedSlots = [];
                const displaySlots = [];

                for (j in closedSlotsAndRawSlots[i].rawSlots) {
                    for (k in closedTimeBlocks) {
                        if (
                            closedSlotsAndRawSlots[i].rawSlots[j].startTimeMoment.isSame(closedTimeBlocks[k].startTime)
                            ||
                            closedSlotsAndRawSlots[i].rawSlots[j].endTimeMoment.isBetween(closedTimeBlocks[k].startTime, closedTimeBlocks[k].endTime)
                            ||
                            closedSlotsAndRawSlots[i].rawSlots[j].startTimeMoment.isBetween(closedTimeBlocks[k].startTime, closedTimeBlocks[k].endTime)
                        ) {
                            eliminatedSlots.push(closedSlotsAndRawSlots[i].rawSlots[j]);
                        } else if (displaySlots.includes(closedSlotsAndRawSlots[i].rawSlots[j]) === false) {
                            displaySlots.push(closedSlotsAndRawSlots[i].rawSlots[j]);
                        }
                    }

                    let m;
                    let n;

                    for (m in displaySlots) {
                        for (n in eliminatedSlots) {
                            if (displaySlots[m] === eliminatedSlots[n]) {
                                delete displaySlots[m];
                            }
                        }
                    }
                }

                courtArrayOfSlotsArrays.push(displaySlots);
            }
            return courtArrayOfSlotsArrays;
        }).then(courtArrayOfSlotsArrays => {
            const displaySlotsFormatted = [];

            let i;
            let j;
            let k;

            for (i in courtArrayOfSlotsArrays) {
                const eliminatedSlots = [];
                const displaySlots = [];

                for (j in courtArrayOfSlotsArrays[i]) {
                    if (this.state.firestoreSlots.length === 0) {
                        displaySlots.push(courtArrayOfSlotsArrays[i][j]);
                    } else {
                        for (k in this.state.firestoreSlots) {
                            if (
                                (courtArrayOfSlotsArrays[i][j].startTimeMoment.isSame(this.state.firestoreSlots[k].startTime)
                                    && courtArrayOfSlotsArrays[i][j].courtRef.path === this.state.firestoreSlots[k].courtRef.path)
                                ||
                                (courtArrayOfSlotsArrays[i][j].endTimeMoment.isBetween(this.state.firestoreSlots[k].startTime, this.state.firestoreSlots[k].endTime)
                                    && courtArrayOfSlotsArrays[i][j].courtRef.path === this.state.firestoreSlots[k].courtRef.path)
                                ||
                                (courtArrayOfSlotsArrays[i][j].startTimeMoment.isBetween(this.state.firestoreSlots[k].startTime, this.state.firestoreSlots[k].endTime)
                                    && courtArrayOfSlotsArrays[i][j].courtRef.path === this.state.firestoreSlots[k].courtRef.path)
                                ||
                                (courtArrayOfSlotsArrays[i][j].endTimeMoment.isSame(this.state.firestoreSlots[k].endTime)
                                    && courtArrayOfSlotsArrays[i][j].courtRef.path === this.state.firestoreSlots[k].courtRef.path)
                                ||
                                (this.state.firestoreSlots[k].startTime.isBetween(courtArrayOfSlotsArrays[i][j].startTimeMoment, courtArrayOfSlotsArrays[i][j].endTimeMoment)
                                    && courtArrayOfSlotsArrays[i][j].courtRef.path === this.state.firestoreSlots[k].courtRef.path)
                                ||
                                (this.state.firestoreSlots[k].endTime.isBetween(courtArrayOfSlotsArrays[i][j].startTimeMoment, courtArrayOfSlotsArrays[i][j].endTimeMoment)
                                    && courtArrayOfSlotsArrays[i][j].courtRef.path === this.state.firestoreSlots[k].courtRef.path)
                            ) {
                                eliminatedSlots.push(courtArrayOfSlotsArrays[i][j]);
                            } else if (displaySlots.includes(courtArrayOfSlotsArrays[i][j]) === false) {
                                displaySlots.push(courtArrayOfSlotsArrays[i][j]);
                            }
                        }
                    }

                    let l;
                    let m;

                    for (l in displaySlots) {
                        for (m in eliminatedSlots) {
                            if (displaySlots[l] === eliminatedSlots[m]) {
                                delete displaySlots[l];
                            }
                        }
                    }
                }

                let n;

                for (n in displaySlots) {
                    const newSlot = {
                        name: `${displaySlots[n].startTimeMoment.tz('America/Toronto').format('h:mmA')} - ${displaySlots[n].endTimeMoment.tz('America/Toronto').format('h:mmA')}`,
                        subtitle: 'Benchmark Sports',
                        startTime: displaySlots[n].startTimeMoment.tz('America/Toronto').format('h:mm A'),
                        endTime: displaySlots[n].endTimeMoment.tz('America/Toronto').format('h:mm A'),
                        courtName: displaySlots[n].courtName, // displaySlots[n].courtRef.id,
                        gymName: displaySlots[n].gymName,
                        startTimeForSorting: displaySlots[n].startTimeMoment,
                        endTimeForNextStep: displaySlots[n].endTimeMoment.unix(),
                        startTimeForNextStep: displaySlots[n].startTimeMoment.unix(),
                        durationForNextStep: this.state.selectedDuration,
                        courtRef: displaySlots[n].courtRef.id,
                    };
                    displaySlotsFormatted.push(newSlot);
                }
            }
            return displaySlotsFormatted;
        }).then(displaySlotsFormattedUnordered => { // order by time first
            return displaySlotsFormattedUnordered.sort((slot1, slot2) => {
                if (moment(slot1.startTimeForSorting).isBefore(slot2.startTimeForSorting)) {
                    return -1;
                }
                return 0;
            });
        }).then(displaySlotsOrderedByStartNotGymName => { // order by gym name 2nd
            return displaySlotsOrderedByStartNotGymName.sort((slot1, slot2) => {
                return slot1.gymName.localeCompare(slot2.gymName);
            });
        }).then(displaySlotsThatDontRemoveSameTimeSameGymSlots => { // remove slots where a gym has multiple courts available at same time
            const displaySlotsOutput = [];
            let i;
            for (i = 0; i < displaySlotsThatDontRemoveSameTimeSameGymSlots.length; i++) {
                if (displaySlotsThatDontRemoveSameTimeSameGymSlots[i + 1] === undefined) { // last one in the array doesnt have a next one to compare
                    displaySlotsOutput.push(displaySlotsThatDontRemoveSameTimeSameGymSlots[i]); // so just add it
                } else if (displaySlotsThatDontRemoveSameTimeSameGymSlots[i + 1].gymName === displaySlotsThatDontRemoveSameTimeSameGymSlots[i].gymName
                    && displaySlotsThatDontRemoveSameTimeSameGymSlots[i + 1].startTime === displaySlotsThatDontRemoveSameTimeSameGymSlots[i].startTime
                    && displaySlotsThatDontRemoveSameTimeSameGymSlots[i + 1].endTime === displaySlotsThatDontRemoveSameTimeSameGymSlots[i].endTime) {
                    // do nothing
                } else {
                    displaySlotsOutput.push(displaySlotsThatDontRemoveSameTimeSameGymSlots[i]);
                }
            }
            return displaySlotsOutput;
        }).then(displaySlotsWithoutRepeatSlotsButSortedByGymName => { // now that repeat slots are gone, reverse it
            return displaySlotsWithoutRepeatSlotsButSortedByGymName.reverse();
        }).then(displaySlots => {
            console.log('time7: ');
            console.log(new Date());

            console.log('displaySlots: ');
            console.log(displaySlots);
            this.setState({vacantSlots: displaySlots});
            return true;
        }).catch(err => {
            console.error(err);
        });
    }

    componentWillUnmount() {
        console.log('unmounted');
        this.unsub();
    }

    render() {

        const slots =
            <ScrollView>
            {
                this.state.vacantSlots.map((l, i) => (
                    <ListItem
                        key={i}
                        // leftAvatar={{ source: { uri: l.avatar_url } }}
                        title={
                            <Text style={{fontSize: 15, textAlign: 'left'}}> {l.name} </Text>
                        }
                        subtitle={
                            <Text style={{color: 'grey', textAlign: 'left'}}> {l.subtitle} - court </Text>
                        }
                        bottomDivider
                        chevron
                        onPress={() => {
                            this.props.navigation.navigate('Book', {
                                start: l.startTimeForNextStep,
                                court: l.courtRef,
                                courtName: l.courtName,
                                end: l.endTimeForNextStep,
                                duration: l.durationForNextStep
                            });
                            Amplitude.logEvent('clicked' + l.name)
                                .then(res => {return true;})
                                .catch(err => console.error(err));
                        }}
                    />
                ))
            }
            </ScrollView>
        ;
        const inPastMessage =
            <View style={{justifyContent: 'center', alignItems: 'center', textAlign: 'left'}}>
                <Text style={{padding: '15%', fontSize: 16}}>can't display slots in the past, please look at future vacancies</Text>
            </View>
        ;
        const noVacanciesToday =
            <View style={{justifyContent: 'center', alignItems: 'center', textAlign: 'left'}}>
                <Text style={{padding: '15%', fontSize: 16}}>
                    no vacant slots for this day, please look at other days
                </Text>
            </View>
        ;
        let display;
        if (this.state.inPast === true) {
            display = inPastMessage;
        } else if (this.state.vacantSlots.length === 0) {
            display = noVacanciesToday;
        } else {
            display = slots;
        }

        return (
            <View style={{flex: 1}}>
                <View style={styles.toggleMonthContainer}>
                    <View style={{flex: 1}}>
                        <Button
                            buttonStyle={{backgroundColor: 'transparent'}}
                            onPress={this.toggleMonth.bind(this, 'left')}
                            icon={<Icon name="arrow-left" color="black"/>}
                            disabled={this.state.headedToPastMonth}
                            disabledStyle={{opacity: 0.3, backgroundColor: 'transparent'}}
                        />
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center', flex: 4}}>
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>{this.state.selectedMonth}</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Button
                            buttonStyle={{backgroundColor: 'transparent'}}
                            onPress={this.toggleMonth.bind(this, 'right')}
                            icon={<Icon name="arrow-right" color="black"/>}
                        />
                    </View>
                </View>
                <View style={styles.toggleMonthContainer}>
                    <View style={{flex: 1}}>
                        <Button
                            buttonStyle={{backgroundColor: 'transparent'}}
                            onPress={this.toggleDayDate.bind(this, 'left')}
                            icon={<Icon name="arrow-left" color="black"/>}
                            disabled={this.state.headedToPastDayDate}
                            disabledStyle={{opacity: 0.3, backgroundColor: 'transparent'}}
                        />
                    </View>
                    <View style={styles.dayDate}>
                        <Text style={styles.monthDayDateFontStyle}>{this.state.day1}</Text>
                    </View>
                    <View style={styles.dayDate}>
                        <Text style={styles.monthDayDateFontStyle}>{this.state.day2}</Text>
                    </View>
                    <View style={styles.dayDate}>
                        <Text style={styles.monthDayDateFontStyle}>{this.state.day3}</Text>
                    </View>
                    <View style={styles.dayDate}>
                        <Text style={styles.monthDayDateFontStyle}>{this.state.day4}</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Button
                            buttonStyle={{backgroundColor: 'transparent'}}
                            onPress={this.toggleDayDate.bind(this, 'right')}
                            icon={<Icon name="arrow-right" color="black"/>}
                        />
                    </View>
                </View>

                <View style={styles.toggleMonthContainer}>
                    <View style={{flex: 1}}>

                    </View>
                    <View style={this.state.selectedDate === 'date1' ? styles.dayDateSelected : styles.dayDate}>
                        <Text
                            style={styles.monthDayDateFontStyle}
                            onPress={this.changeSelectedDate.bind(this, 'date1')}
                        >
                            {this.state.date1}
                        </Text>
                    </View>
                    <View style={this.state.selectedDate === 'date2' ? styles.dayDateSelected : styles.dayDate}>
                        <Text
                            style={styles.monthDayDateFontStyle}
                            onPress={this.changeSelectedDate.bind(this, 'date2')}
                        >
                            {this.state.date2}
                        </Text>
                    </View>
                    <View style={this.state.selectedDate === 'date3' ? styles.dayDateSelected : styles.dayDate}>
                        <Text
                            style={styles.monthDayDateFontStyle}
                            onPress={this.changeSelectedDate.bind(this, 'date3')}
                        >
                            {this.state.date3}
                        </Text>
                    </View>
                    <View style={this.state.selectedDate === 'date4' ? styles.dayDateSelected : styles.dayDate}>
                        <Text
                            style={styles.monthDayDateFontStyle}
                            onPress={this.changeSelectedDate.bind(this, 'date4')}
                        >
                            {this.state.date4}
                        </Text>
                    </View>
                    <View style={{flex: 1}}>

                    </View>
                </View>
                <View style={styles.toggleMonthContainer}>

                    <View style={{flex: 1, marginVertical: '3%'}}>
                        <Button
                            buttonStyle={this.state.selectedDuration === '1' ? styles.durationButtonSelected : styles.durationButton}
                            onPress={this.changeSelectedDuration.bind(this, '1')}
                            title="1 hour"
                            titleStyle={{color: 'black'}}
                            type="outline"
                        />
                    </View>
                    <View style={{flex: 1, marginVertical: '3%'}}>
                        <Button
                            buttonStyle={this.state.selectedDuration === '1.5' ? styles.durationButtonSelected : styles.durationButton}
                            onPress={this.changeSelectedDuration.bind(this, '1.5')}
                            title="1.5 hour"
                            titleStyle={{color: 'black'}}
                            type="outline"
                        />
                    </View>

                    <View style={{flex: 1, marginVertical: '3%'}}>
                        <Button
                            buttonStyle={this.state.selectedDuration === '2' ? styles.durationButtonSelected : styles.durationButton}
                            onPress={this.changeSelectedDuration.bind(this, '2')}
                            title="2 hours"
                            titleStyle={{color: 'black'}}
                            type="outline"
                        />
                    </View>

                </View>
                {display}
                {/*<ScrollView>*/}
                {/*    {*/}
                {/*        // this.state.rawSlots.map((l, i) => (*/}
                {/*        this.state.vacantSlots.map((l, i) => (*/}
                {/*            <ListItem*/}
                {/*                key={i}*/}
                {/*                // leftAvatar={{ source: { uri: l.avatar_url } }}*/}
                {/*                title={*/}
                {/*                    <Text style={{fontSize: 15, textAlign: 'left'}}> {l.name} </Text>*/}
                {/*                }*/}
                {/*                subtitle={*/}
                {/*                    <Text style={{color: 'grey', textAlign: 'left'}}> {l.subtitle} </Text>*/}
                {/*                }*/}
                {/*                bottomDivider*/}
                {/*                chevron*/}
                {/*                onPress={() => this.props.navigation.navigate('Book')}*/}
                {/*            />*/}
                {/*            ))*/}
                {/*    }*/}
                {/*</ScrollView>*/}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    toggleMonthContainer: {
        flexDirection: 'row'
    },
    monthDayDateFontStyle: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    dayDateSelected: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'orange',
        borderRadius: 20
    },
    dayDate: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    durationButton: {
        marginHorizontal: '8%',
        borderColor: 'black'
    },
    durationButtonSelected: {
        marginHorizontal: '8%',
        backgroundColor: 'orange',
        borderColor: 'black'
    },
});
