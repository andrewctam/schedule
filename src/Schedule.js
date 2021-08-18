
import React from 'react';
import TimeSlot from './TimeSlot.js'

class Schedule extends React.Component { 
    forceScheduleUpdate = () => {this.forceUpdate();}   
    render() {               
        const today = new Date();   
        var scheduleToday = [];
        var scheduleToRender = [];

        //3 = sun, 4 = mon, 5 = tue, 6 = wed, 7 = thu, 8 = fri, 9 = sun
        for (var j = 0; j < this.props.schedule.length; j++) {
            if (this.props.schedule[j][today.getDay() + 4]) {
                scheduleToday.push(this.props.schedule[j]);
            }
        }
        
        if (scheduleToday.length > 0) {
            scheduleToday = this.sortTimeSlots(scheduleToday);
            var classes = this.determineClasses(scheduleToday);

            scheduleToRender = (scheduleToday.map((x, index) => 
                <TimeSlot
                key = {"ts" + index}
                name = {x[0]}       info = {x[3]}
                startTime = {x[1]}  endTime = {x[2]}
                when = {classes[index]}
                />));

        } else if (this.props.schedule.length === 0 ) {
            scheduleToRender = (<h1>Click [Edit Schedule] Above to Add Classes</h1>)
        } else {
            scheduleToRender = (<h1>No Classes Today</h1>)
        }

        
        return <div>{scheduleToRender}</div>; 
    }
    
    sortTimeSlots = (timeSlots) => { //simple x^2 sort
        var minJ;
        for (var i = 0; i < timeSlots.length; i++) {    
            minJ = i;
            for (var j = i + 1; j < timeSlots.length; j++) {
                if (timeSlots[minJ][1] > timeSlots[j][1]) {
                    minJ = j;
                } else if (timeSlots[minJ][2] > timeSlots[j][2]) {
                    minJ = j;
                }
            } 
            var temp = timeSlots[i];
            timeSlots[i] = timeSlots[minJ];
            timeSlots[minJ] = temp;
        } 
        return timeSlots;
    }

    determineClasses = (timeSlots) => {
        var classes = [];
        for (var i = 0; i < timeSlots.length; i++) {
            var currentTime = new Date();
            var earlyTime = new Date();
            earlyTime.setMinutes(earlyTime.getMinutes() + 10);

            var startTime = this.stringToDate(timeSlots[i][1]);
            var endTime = this.stringToDate(timeSlots[i][2]);
            
            if (currentTime <= endTime || timeSlots[i][2] === "") { //10:00 < 12:00
                if (startTime <= currentTime)
                    classes.push("classInProgress");
                else if (startTime <= earlyTime)
                    classes.push("classSoon");
                else 
                    classes.push("classInFuture");
            }
            else 
                classes.push("classOver");
        }
        return classes;
    }

    stringToDate = (str) => {
        var hrs = str.substring(0, 2);
        var mins = str.substring(3, 5);
        var time = new Date();
        time.setHours(parseInt(hrs));
        time.setMinutes(parseInt(mins));
        time.setSeconds(0);
        return time;
    }
    


    componentDidMount() {
        var timeToNextMinute = 60000 - (new Date().getSeconds() * 1000);
        this.waitUntilMinute = setInterval(() => this.repeatEveryMin(), timeToNextMinute);
    }

    repeatEveryMin() {
        clearInterval(this.waitUntilMinute);
        this.forceUpdate();
        this.interval = setInterval(() => this.forceUpdate(), 60000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        clearInterval(this.waitUntilMinute);
    }
}

export default Schedule;
