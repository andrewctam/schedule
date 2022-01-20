import React from 'react';
import Editor from './Editor.js';
import DailySchedule from './DailySchedule.js';
import WeeklySchedule from './WeeklySchedule.js';
import { decompressFromBase64 } from "lz-string"
import { compressToBase64 } from "lz-string"
import "./styles.css"

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
                    
                    schedule.push([ 
                        currentTimeSlot[0],
                        currentTimeSlot[1],
                        currentTimeSlot[2],
                        currentTimeSlot[3],
                        dayBools[0],
                        dayBools[1],
                        dayBools[2],
                        dayBools[3],
                        dayBools[4],
                        dayBools[5],
                        dayBools[6],
                        "#" + currentTimeSlot[5]
                    ]);
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
            if (this.state.schedule[i][4] || this.state.schedule[i][10]) { //sat or sun
                days = [0, 1, 2, 3, 4, 5, 6]
                break;
            }
        }

        return (
        <div>
            <Editor schedule={this.state.schedule} 
            updateClass={this.updateClass} 
            addEmptyClass = {this.addEmptyClass}
            removeClass = {this.removeClass}
            toggleWeekly = {this.toggleWeekly}
            weekly = {this.state.weekly}
            link = {"https://andrewtam.org/schedule/?" + this.state.savedURL}
            updateURL = {this.updateURL}
            randomizeColors={this.randomizeColors}

            /> 
            
            {this.state.weekly ? 
                <WeeklySchedule days = {days} 
                schedule = {this.state.schedule} 
                updateEntireSchedule = {this.updateEntireSchedule}
                generateExample = {this.generateExample}/> 
                : 
                <DailySchedule schedule = {this.state.schedule} 
                updateEntireSchedule = {this.updateEntireSchedule}
                generateExample = {this.generateExample}/>
            }
        </div>
        //schedule is {[name, startTime, endTime, link, sun (bool), ..., sat, color], 
        //             [name, startTime, endTime, link, sun, ..., sat, color] ...}
        );
    } 
    randomizeColors = () => {
        var temp = this.state.schedule;
        for (var i = 0; i < temp.length; i++) {
            temp[i][11] = this.generateRandomColor();
        }
        this.setState({schedule: temp},() => {this.saveSchedule(false)});;
    }
    
    updateEntireSchedule = (updatedSchedule) => {
        this.setState({schedule: updatedSchedule}, () => {
            this.saveSchedule(true); 
        });
    }

    updateClass = (timeSlot, i, newValue) => {
        var temp = this.state.schedule;
        temp[timeSlot][i] = newValue;
        this.setState({schedule: temp}, () => {this.saveSchedule(false)});
    }
    addEmptyClass = () => {
        var temp = this.state.schedule;
        temp.push(["","11:30","13:30","", false, false, false, false, false, false, false, this.generateRandomColor()]);
        this.setState({schedule: temp}, () => {this.saveSchedule(false)});
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
            ["BIO 102", "10:15", "11:45", "Main Lecture Hall 102", false, true, false, true, false, true, false, this.generateRandomColor()],
            ["CSE 103", "13:15", "14:40", "Engineering 112", false, false, true, false, true, false, false, this.generateRandomColor()],
            ["MAT 144", "12:00", "13:00", "https://zoom.us/...", false, false, true, false, true, false, false, this.generateRandomColor()],
            ["MUS 101", "08:30", "09:40", "Center of Arts 500",  false, true, false, true, false, false, false, this.generateRandomColor()],
            ["POL 181", "16:30", "17:20", "https://zoom.us/...",  false, true, false, true, false, false, false, this.generateRandomColor()],
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
            strOutput += this.state.schedule[i][0] + "<" + //name
                         this.state.schedule[i][1] + "<" + //start time
                         this.state.schedule[i][2] + "<" + //end time
                         this.state.schedule[i][3] + "<";  //location

            //days of week
            for (var day = 0; day < 7; day++) {
                if (this.state.schedule[i][day + 4])
                    strOutput += day;
            }
            strOutput += "<";

            //color
            strOutput += this.state.schedule[i][11].substring(1);
            
            if (i !== this.state.schedule.length - 1) {
                strOutput += ">";
            }
        }
        
    
        var compressed;
        if (strOutput !== "") {
            compressed = compressToBase64(strOutput);
        } else
            compressed = "";
            
        console.log(strOutput)
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


export default App;
