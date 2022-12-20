import React from 'react';
import Settings from './settings/Settings.js';
import DailySchedule from './schedule/DailySchedule.js';
import WeeklySchedule from './schedule/WeeklySchedule.js';
import QuickActions from './schedule/QuickActions.js';

import { decompressFromBase64 } from "lz-string"
import { compressToBase64 } from "lz-string"

class App extends React.Component {
    constructor(props) {
        super(props);
        var schedule = [];
        //Check to see if the link has parameters
        //PWA
        if (window.matchMedia('(display-mode: standalone)').matches) {
            var link = localStorage.getItem('savedURL');
            if (link === "" || link === null) {
                link = window.location.href;
                var delim = link.indexOf('?');
                link = link.substring(delim + 1);
            }

        } else {//not PWA
            link = window.location.href;
            delim = link.indexOf('?');
            link = link.substring(delim + 1);
        }
        
        //no save found
        if (delim === -1) {
            this.state = { schedule: [], weekly: true, savedURL: "", deleted: [] };    
        } else { //parameters found, try to create schedule
            try {
                var savedSchedule = decompressFromBase64(link);
                //weekly
                //0
                var weekly = savedSchedule.substring(0, 1) === "1";
                const classes = savedSchedule.split('>');
                for (var i = 1; i < classes.length; i++) {
                    var currentTimeSlot = classes[i].split('<');
                    //name<startTime<endTime<example.com<0135<color
                    //name2<startTime2<endTime2<example2.com<246<color ...
                    //0      1          2         3          4            5
                
                    var daysList = currentTimeSlot[4].split("");
                    var dayBools = [false, false, false, false, false, false, false];
                    for (var j = 0; j < daysList.length; j++) {
                        dayBools[parseInt(daysList[j])] = true;
                    }
                    
                    schedule.push(new ClassOnSchedule(
                        currentTimeSlot[0],
                        currentTimeSlot[1],
                        currentTimeSlot[2],
                        currentTimeSlot[3],
                        [dayBools[0],
                        dayBools[1],
                        dayBools[2],
                        dayBools[3],
                        dayBools[4],
                        dayBools[5],
                        dayBools[6]],
                        "#" + currentTimeSlot[5]
                        )
                    );
                }
                this.state = { schedule: schedule, weekly: weekly, savedURL: link, deleted: []};
            } catch (error) {
                console.log("Schedule saved to URL is invalid or outdated")
                this.state = { schedule: [], weekly: true, savedURL: "", deleted: [] };    
            }
        } 
    }

    render() {
        //should we render weekends on weekly schedule?
        var days = [1, 2, 3, 4, 5];
        for (var i = 0; i < this.state.schedule.length; i++) {
            if (this.state.schedule[i].days[0] || this.state.schedule[i].days[6]) { //sat or sun
                days = [0, 1, 2, 3, 4, 5, 6]
                break;
            }
        }
        
        document.documentElement.style.setProperty("--numDays", (100 / (days.length + 1)) + "%");

        return (
        <div>
            <Settings schedule={this.state.schedule} 
            updateClass={this.updateClass} 
            updateEntireSchedule = {this.updateEntireSchedule}
            addEmptyClass = {this.addEmptyClass}
            removeClass = {this.removeClass}
            toggleWeekly = {this.toggleWeekly}
            weekly = {this.state.weekly}
            link = {"https://andrewtam.org/schedule/?" + this.state.savedURL}
            updateURL = {this.updateURL}
            randomizeColors={this.randomizeColors}
            /> 
            

            {this.state.schedule.length === 0 ? 
                <QuickActions 
                generateExample = {this.generateExample}
                updateEntireSchedule = {this.updateEntireSchedule}/> 
            : this.state.weekly ? 
                <WeeklySchedule 
                days = {days} 
                schedule = {this.state.schedule} 
                updateEntireSchedule = {this.updateEntireSchedule}
                /> 
            : 
                <DailySchedule 
                schedule = {this.state.schedule} 
                updateEntireSchedule = {this.updateEntireSchedule}
                />
            }

        </div>
        //schedule is {[name, startTime, endTime, link, sun (bool), ..., sat, color], 
        //             [name, startTime, endTime, link, sun, ..., sat, color] ...}
        );
    } 
    randomizeColors = () => {
        var temp = this.state.schedule;
        for (var i = 0; i < temp.length; i++) {
            temp[i].color = this.generateRandomColor();
        }
        this.setState({schedule: temp},() => {this.saveSchedule(false)});;
    }
    
    updateEntireSchedule = (updatedSchedule) => {
        this.setState({schedule: updatedSchedule}, () => {
            this.saveSchedule(true); 
        });
    }

    updateClass = (timeSlot, toChange, newValue) => {
        var temp = this.state.schedule;
        console.log(toChange)
        switch (toChange) {
            case "name": 
                temp[timeSlot].name = newValue;
                break;
            case "startTime":
                temp[timeSlot].startTime = newValue;
                if (newValue !== "") {
                    var hrs = newValue.substring(0, 2);
                    var mins = newValue.substring(3, 5);
                    var time = new Date();
                    time.setHours(parseInt(hrs));
                    time.setMinutes(parseInt(mins));
                    time.setSeconds(0);
                    temp[timeSlot].startTimeDate = time;
                } else {
                    temp[timeSlot].startTimeDate = new Date();
                }
                break;
            case "endTime":
                temp[timeSlot].endTime = newValue;
                if (newValue !== "") {
                    var hrs = newValue.substring(0, 2);
                    var mins = newValue.substring(3, 5);
                    var time = new Date();
                    time.setHours(parseInt(hrs));
                    time.setMinutes(parseInt(mins));
                    time.setSeconds(0);
                    temp[timeSlot].endTimeDate = time;
                } else {
                    temp[timeSlot].endTimeDate = new Date();
                }                
                break;
            case "location":
                temp[timeSlot].location = newValue;
                break;
            case "color":
                temp[timeSlot].color = newValue;
                break;
            case "su":
                temp[timeSlot].days[0] = newValue;
                break;
            case "mo":
                temp[timeSlot].days[1] = newValue;
                break;
            case "tu": 
                temp[timeSlot].days[2] = newValue;
                break;
            case "we": 
                temp[timeSlot].days[3] = newValue;
                break;
            case "th":
                temp[timeSlot].days[4] = newValue;
                break;
            case "fr":
                temp[timeSlot].days[5] = newValue;
                break;
            case "sa":
                temp[timeSlot].days[6] = newValue;
                break;
            default: break;
        }
        this.setState({schedule: temp}, () => {this.saveSchedule(false)});
    }
    addEmptyClass = () => {
        var temp = this.state.schedule;
        temp.push(new ClassOnSchedule("","11:30","13:30","", [false, false, false, false, false, false, false], this.generateRandomColor()));
        this.setState({schedule: temp}, () => {
            this.saveSchedule(false);
            var editors = document.getElementById("editors");
            if (editors !== null) {
                editors.scrollTop = editors.scrollHeight;
            }
        });
        
    }
    
    removeClass = (i) => {
        var tempSchedule = this.state.schedule;
        var tempDeleted = this.state.deleted;
        tempDeleted.push(tempSchedule.splice(i, 1)[0]);
        this.setState({schedule: tempSchedule, delete: tempDeleted}, () => {this.saveSchedule(false)});
    }
    toggleWeekly = (e) => {
        var temp = !this.state.weekly;
        this.setState({weekly: temp}, () => {this.saveSchedule(false)});
    }

    generateExample = () => {
        var temp = [
            new ClassOnSchedule("BIO 102", "10:15", "11:45", "Main Lecture Hall 102", [false, true, false, true, false, true, false], this.generateRandomColor()),
            new ClassOnSchedule("CSE 103", "13:15", "14:40", "Engineering 112", [false, false, true, false, true, false, false], this.generateRandomColor()),
            new ClassOnSchedule("MAT 144", "12:00", "13:00", "https://zoom.us/...", [false, false, true, false, true, false, false], this.generateRandomColor()),
            new ClassOnSchedule("MUS 101", "08:30", "09:40", "Center of Arts 500",  [false, true, false, true, false, false, false], this.generateRandomColor()),
            new ClassOnSchedule("POL 181", "16:30", "17:20", "https://zoom.us/...",  [false, true, false, true, false, false, false], this.generateRandomColor()),
            ];

        this.setState({schedule: temp}, () => {this.saveSchedule(false)});
    }
    generateRandomColor() {
        var hexa = ["A", "B", "C", "D", "E", "F"]
        var color = "#";
        for (var i = 0; i < 6; i++) {
            color += hexa[Math.floor(Math.random() * 6)];
        }
        return color;
    }

    saveSchedule = (updateURL) => {
    //weekly (bool)>
    //name<startTime<endTime<example.com<0135<color>
    //name2<startTime2<endTime2<example2.com<246<color> ...
        if (this.state.schedule.length === 0) {
            this.setState({savedURL: ""}, () => {this.updateURL()})
            return;
        }

        //settings
        if (this.state.weekly)
            var strOutput = "1";
        else 
            strOutput = "0";

        strOutput += ">"
            
        //classes
        for (var i = 0; i < this.state.schedule.length; i++) {
            strOutput += this.state.schedule[i].name + "<" + //name
                         this.state.schedule[i].startTime + "<" + //start time
                         this.state.schedule[i].endTime + "<" + //end time
                         this.state.schedule[i].location + "<";  //location

            //days of week
            for (var day = 0; day < 7; day++) {
                if (this.state.schedule[i].days[day])
                    strOutput += day;
            }
            strOutput += "<";

            //color
            strOutput += this.state.schedule[i].color.substring(1);
            
            if (i !== this.state.schedule.length - 1) {
                strOutput += ">";
            }
        }
        
    
        var compressed;
        if (strOutput !== "") {
            compressed = compressToBase64(strOutput);
        } else
            compressed = "";
            
        if (updateURL)
            this.setState({savedURL: compressed}, () => {this.updateURL()})
        else
            this.setState({savedURL: compressed})
    }       

    updateURL = () => {
        const url = new URL(window.location);
        url.search = this.state.savedURL;
        window.history.pushState({}, '', url);   
        localStorage.setItem('savedURL', this.state.savedURL);
    }


}

class ClassOnSchedule {
    constructor(name, startTime, endTime, location, days, color) {
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
        this.location = location
        this.days = days;
        this.color = color;
        
        if (startTime !== "") {
            var hrs = startTime.substring(0, 2);
            var mins = startTime.substring(3, 5);
            var time = new Date();
            time.setHours(parseInt(hrs));
            time.setMinutes(parseInt(mins));
            time.setSeconds(0);
            this.startTimeDate = time;
        } else {
            this.startTimeDate = new Date();
        }

        if (endTime !== "") {
            hrs = endTime.substring(0, 2);
            mins = endTime.substring(3, 5);
            time = new Date();
            time.setHours(parseInt(hrs));
            time.setMinutes(parseInt(mins));
            time.setSeconds(0);
            this.endTimeDate = time;
        } else {
            this.endTimeDate = new Date();
        }


    }
}


export {ClassOnSchedule};
export default App;
