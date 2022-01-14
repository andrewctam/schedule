
import React from 'react';
import TimeSlot from './TimeSlot.js'

class DailySchedule extends React.Component { 
    forceScheduleUpdate = () => {this.forceUpdate();}   
    render() {               
        const today = new Date();   
        var scheduleToday = [];  

        //3 = sun, 4 = mon, 5 = tue, 6 = wed, 7 = thu, 8 = fri, 9 = sun
        for (var j = 0; j < this.props.schedule.length; j++) {
            if (this.props.schedule[j][today.getDay() + 4]) {
                scheduleToday.push(this.props.schedule[j]);
            }
        }
        if (scheduleToday.length > 0) {
            scheduleToday = this.sortTimeSlots(scheduleToday);
            var result = this.determineTimes(scheduleToday);
            var classes = result[0]
            var timeToNextClass = result[1]

            scheduleToday = (scheduleToday.map((x, index) => 
                <TimeSlot
                key = {"ts" + index}
                name = {x[0]}       
                startTime = {x[1]}  
                endTime = {x[2]}
                info = {x[3]}
                when = {classes[classes.length - 1 - index]}
                />));

        } else if (this.props.schedule.length === 0) {
            return (<div className = "example">
                        <h6>Click [Edit Schedule] above to add classes or click below to generate an example</h6>
                        <button className = "btn btn-primary example" 
                            onClick = {() => this.props.generateExample()}>
                            Generate Example Schedule</button>
                            <hr/>
                        <h6>If you are an SBU Student, you can copy and paste your schedule from your SOLAR. 
                            <br/>Go to SOLAR > Student Records & Registration > Academic Planning > Enrollment Shopping Cart and scroll down. Highlight and copy the entire table</h6>
                        <input id = "SOLAR" className = "SOLAR" onChange = {this.handleChange} placeholder="Paste Here"/>

                    </div>);        
        } else {
            return (<h1>No Classes Today</h1>);
        }

        
        return (<div>
                    <p>{this.formatMinutes(timeToNextClass)}</p>
                    {scheduleToday}
                </div>); 
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

    determineTimes = (timeSlots) => {
        var classes = [];
        var timeToNextClass = -1;
         
        for (var i = timeSlots.length - 1; i > -1; i--) {
            var currentTime = new Date();
            var earlyTime = new Date();
            earlyTime.setMinutes(earlyTime.getMinutes() + 10);

            var startTime = this.stringToDate(timeSlots[i][1]);
            var endTime = this.stringToDate(timeSlots[i][2]);
            
            if (currentTime <= endTime || timeSlots[i][2] === "") { //10:00 < 12:00
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

    stringToDate = (str) => {
        var hrs = str.substring(0, 2);
        var mins = str.substring(3, 5);
        var time = new Date();
        time.setHours(parseInt(hrs));
        time.setMinutes(parseInt(mins));
        time.setSeconds(0);
        return time;
    }

    handleChange = (e) => {
        var inputStr = e.target.value;
        //index of next class in string. Current class index will be 0. 
        //inputStr = ABC 123- ... DEF 456- ... GHI 789-
        var nextClassIndex = inputStr.search(/[A-Z]{3} [0-9]{3}-/);
        var classes = []; //will hold classes substrings
    
        if (nextClassIndex === -1) {
            alert("No classes found. Make sure to copy the entire table.")
            e.target.value = "";
            return;
        }
        // delete chars before the first class
        inputStr = inputStr.substring(nextClassIndex)

        while (nextClassIndex !== -1) {
            //search for the NEXT class. Remove the first 8 chars (ABC 123-) so we don't find this current class
            nextClassIndex = inputStr.substring(8).search(/[A-Z]{3} [0-9]{3}-/)
            //if this is the last found class, since we can't find another class after this
            if (nextClassIndex === -1) { 
                classes.push(inputStr);
                break;

            } else {
                //add the current class to classes and remove the info from the input string
                //add 8 since we removed 8 chars from the search before 
                classes.push(inputStr.substring(0, nextClassIndex + 8))
                inputStr = inputStr.substring(nextClassIndex + 8);
            }
        }
        this.props.updateEntireSchedule(this.classesStringToSchedule(classes));
        
    }

    classesStringToSchedule(stringArray) {
        var schedule = [];
        var timeInfo, startTime, endTime, location, daysOfWeek;
        for (var i = 0; i < stringArray.length; i++) {
            timeInfo = stringArray[i].match(/[0-9]{1,2}:[0-9]{1,2}[AP]M - [0-9]{1,2}:[0-9]{1,2}[AP]M/)
            if (timeInfo === null) {
                startTime = "12:00AM";
                endTime = "12:00AM";
                location = "ONLINE";
                daysOfWeek = "MoTuWeThFr"

            } else {
                startTime = this.AMPMto24H(timeInfo[0].substring(0, timeInfo[0].indexOf("-") - 1)) 
                endTime = this.AMPMto24H(timeInfo[0].substring(timeInfo[0].indexOf("-") + 2)) 
                location = stringArray[i].substring(timeInfo[0].length + timeInfo["index"], stringArray[i].search(/([A-Z]\. )|[Ss][Tt][Aa][Ff][Ff]/))
                daysOfWeek = stringArray[i].match(/\) (Su|Mo|Tu|We|Th|Fr|Sa){1,5} /)
            }

            schedule.push([stringArray[i].substring(0, 7),
                            startTime, 
                            endTime, 
                            location,
                            daysOfWeek[0].includes("Su"),
                            daysOfWeek[0].includes("Mo"),
                            daysOfWeek[0].includes("Tu"),
                            daysOfWeek[0].includes("We"),
                            daysOfWeek[0].includes("Th"),
                            daysOfWeek[0].includes("Fr"),
                            daysOfWeek[0].includes("Sa")]); 
        }
        console.log(schedule);
        return schedule;
    }

    AMPMto24H(str) {
        var colon = str.indexOf(":");
        var hrs = str.substring(0, colon) 
        var mins = str.substring(colon + 1, str.indexOf("M") - 1)
        if (str.includes("PM") && hrs < 12)
            hrs = parseInt(hrs) + 12
        return hrs + ":" + mins;  
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
