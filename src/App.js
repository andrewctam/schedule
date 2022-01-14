import React from 'react';
import Editor from './Editor.js';
import DailySchedule from './DailySchedule.js';
import WeeklySchedule from './WeeklySchedule.js';
import { decompressFromBase64 } from "lz-string"
import { compressToBase64 } from "lz-string"


class App extends React.Component {
    constructor(props) {
        super(props);
        var schedule = [];
        //Check to see if the link has parameters
        if (window.matchMedia('(display-mode: standalone)').matches) {

            var link = localStorage.getItem('savedURL');
            if (link === "" || link === null) {
                link = window.location.href;
                var delim = link.indexOf('?');
                link = link.substring(delim + 1);
            }

        } else {
            link = window.location.href;
            delim = link.indexOf('?');
            link = link.substring(delim + 1);
        }
        
        if (delim !== -1) {
            var savedSchedule = decompressFromBase64(link);
            var weekly = savedSchedule.substring(0, 1) === "1";
            const timeSlots = savedSchedule.split('>');
            for (var i = 1; i < timeSlots.length; i++) {
                var currentTimeSlot = timeSlots[i].split('<');
                //name>startTime>endTime>example.com>0>1>2>3>4>5>6&
            
                var daysList = [false, false, false, false, false, false, false];
                for (var j = 4; j < currentTimeSlot.length; j++) {
                    daysList[parseInt(currentTimeSlot[j])] = true;
                }
                
                schedule.push([ 
                    currentTimeSlot[0],
                    currentTimeSlot[1],
                    currentTimeSlot[2],
                    currentTimeSlot[3],
                    daysList[0],
                    daysList[1],
                    daysList[2],
                    daysList[3],
                    daysList[4],
                    daysList[5],
                    daysList[6]
                ]);

            }
        } else {
            weekly = true;
        }
            
        this.state = { schedule: schedule, weekly: weekly, savedURL: link, deleted: []};
    }

    render() {
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
        //schedule is {[name, startTime, endTime, link, sun ... sat], 
        //             [name, startTime, endTime, link, sun ... sat] ...}
        );
    } 
    
    updateEntireSchedule = (updatedSchedule) => {
        this.setState({schedule: updatedSchedule}, () => {this.saveSchedule()});
    }

    updateClass = (timeSlot, i, newValue) => {
        var temp = this.state.schedule;
        temp[timeSlot][i] = newValue;
        this.setState({schedule: temp}, () => {this.saveSchedule()});
    }
    addEmptyClass = () => {
        var temp = this.state.schedule;
        temp.push(["","11:30","13:30","", false, false, false, false, false, false, false]);
        this.setState({schedule: temp}, () => {this.saveSchedule()});
    }
    removeClass = (i) => {
        var tempSchedule = this.state.schedule;
        var tempDeleted = this.state.deleted;
        tempDeleted.push(tempSchedule.splice(i, 1)[0]);
        this.setState({schedule: tempSchedule, delete: tempDeleted}, () => {this.saveSchedule()});
    }
    toggleWeekly = (e) => {
        var temp = !this.state.weekly;
        this.setState({weekly: temp}, () => {this.saveSchedule()});
    }

    generateExample = () => {
        var temp = [
            ["BIO 102", "10:15", "11:45", "Main Lecture Hall 102", false, true, false, true, false, true, false],
            ["CSE 103", "13:15", "14:40", "Engineering 112", false, false, true, false, true, false, false],
            ["MAT 144", "12:00", "13:00", "https://zoom.us/...", false, false, true, false, true, false, false],
            ["MUS 101", "08:30", "09:40", "Center of Arts 500",  false, true, false, true, false, false, false],
            ["POL 181", "16:30", "17:20", "https://zoom.us/...",  false, true, false, true, false, false, false],
            ];

        this.setState({schedule: temp}, () => {this.saveSchedule()});
    }

    saveSchedule = () => {
        if (this.state.weekly)
            var strOutput = "1";
        else 
            strOutput = "0";

        if (this.state.schedule.length !== 0)
            strOutput += ">"
            
        for (var i = 0; i < this.state.schedule.length; i++) {
            strOutput += this.state.schedule[i][0] + "<" + this.state.schedule[i][1] + "<" + this.state.schedule[i][2] + "<" + this.state.schedule[i][3] + "<";
            for (var day = 0; day < 7; day++) {
                if (this.state.schedule[i][day + 4])
                    strOutput += day + "<";
            }

            if (i !== this.state.schedule.length - 1) {
                strOutput += ">";
            }
        }
        
        var urlParams;
        if (strOutput !== "") {
            urlParams = compressToBase64(strOutput);
        } else
            urlParams = "";
            
        localStorage.setItem('savedURL', urlParams);


        const url = new URL(window.location);
        url.search = urlParams;
        window.history.pushState({}, '', url);

        this.setState({savedURL: urlParams})
    }
}


export default App;
