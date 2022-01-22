
import React from 'react';
import TimeSlot from './TimeSlot.js'
import QuickActions from './QuickActions.js';

class DailySchedule extends React.Component { 
    forceScheduleUpdate = () => {this.forceUpdate();}   
    render() {               
        if (this.props.schedule.length === 0) {
            return (<QuickActions 
            generateExample = {this.props.generateExample}
            updateEntireSchedule = {this.props.updateEntireSchedule}/>);   
        }
        
        const today = new Date();   
        var scheduleToday = [];  

        //3 = sun, 4 = mon, 5 = tue, 6 = wed, 7 = thu, 8 = fri, 9 = sun
        for (var j = 0; j < this.props.schedule.length; j++) {
            if (this.props.schedule[j].days[today.getDay()]) {
                scheduleToday.push(this.props.schedule[j]);
            }
        }

        if (scheduleToday.length === 0) {
            return (<h1>No Classes Today</h1>);
        } else {
            scheduleToday = this.sortTimeSlots(scheduleToday);
            var result = this.determineTimes(scheduleToday);
            var classes = result[0]
            var timeToNextClass = result[1]

            scheduleToday = (scheduleToday.map((x, index) => 
                <TimeSlot
                key = {"ts" + index}
                name = {x.name}       
                startTime = {x.startTime}  
                endTime = {x.endTime}
                location = {x.location}
                when = {classes[classes.length - 1 - index]}
            />));
    
            return (<div>
                        <p>{this.formatMinutes(timeToNextClass)}</p>
                        {scheduleToday}
                    </div>); 
        }
    }
    
    formatMinutes = (num) => {
        if (isNaN(num) || num === -1) 
            return "";

        var mins = Math.ceil(num);
        var hrs = Math.floor(mins / 60);
        mins = mins % 60;

        var minuteWord = mins === 1 ? " min" : " mins";
        var hourWord = hrs === 1 ? " hour" : " hours";
        
        if (hrs === 0) {
            return mins + minuteWord + " to next class"; 
        } else
            return hrs + hourWord + " " + mins + minuteWord + " to next class";
            
    }
    sortTimeSlots = (timeSlots) => { //simple x^2 sort
        var minJ;
        for (var i = 0; i < timeSlots.length; i++) {    
            minJ = i;
            for (var j = i + 1; j < timeSlots.length; j++) {
                if (timeSlots[minJ].startTime > timeSlots[j].endTime) {
                    minJ = j;
                } else if (timeSlots[minJ].endTime > timeSlots[j].startTime) {
                    minJ = j;
                }
            } 
            var temp = timeSlots[i];
            timeSlots[i] = timeSlots[minJ];
            timeSlots[minJ] = temp;
        } 
        return timeSlots;
    }

    determineTimes = (timeSlots) => {
        var classes = [];
        var timeToNextClass = -1;
         
        for (var i = timeSlots.length - 1; i > -1; i--) {
            var currentTime = new Date();
            var earlyTime = new Date();
            earlyTime.setMinutes(earlyTime.getMinutes() + 10);

            var startTime = timeSlots[i].startTimeDate;
            var endTime = timeSlots[i].endTimeDate;
            
            if (currentTime <= endTime || timeSlots[i].endTIme === "") { //10:00 < 12:00
                if (startTime <= currentTime) 
                    classes.push("classInProgress");
                else {
                    timeToNextClass = (startTime - currentTime) / 60000
                    if (startTime <= earlyTime)
                        classes.push("classSoon");
                    else 
                        classes.push("classInFuture");
                }
            }
            else 
                classes.push("classOver");
        }
        return [classes, timeToNextClass];
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

export default DailySchedule;
