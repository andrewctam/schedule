import React from 'react';
import Editor from './Editor.js';
import DailySchedule from './DailySchedule.js';
import WeeklySchedule from './WeeklySchedule.js';
import { decompressFromBase64 } from "lz-string"
import { compressToBase64 } from "lz-string"


class App extends React.Component {
    constructor(props) {
        super(props);
        var scheduleFromLink = [];
            //Check to see if the link has parameters
            var link = window.location.href;
            var delim = link.indexOf('?');
            link = link.substring(delim + 1);
            
            var savedSchedule = decompressFromBase64(link);
            var weekly = true;
            if (delim !== -1) {
                weekly = savedSchedule.substring(0, 1) === "1";
                const timeSlots = savedSchedule.split('>');
                for (var i = 1; i < timeSlots.length; i++) {
                    var currentTimeSlot = timeSlots[i].split('<');
                    //name-startTime-endTime-example.com-0-1-2-3-4-5-6&
                
                    var daysList = [false, false, false, false, false, false, false];
                    for (var j = 4; j < currentTimeSlot.length; j++) {
                        daysList[parseInt(currentTimeSlot[j])] = true;
                    }
                    
                    scheduleFromLink.push([ 
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
            }
        this.state = { schedule: scheduleFromLink, weekly: weekly};

    }
    render() {

        
        var days = [1, 2, 3, 4, 5];
        for (var i = 0; i < this.state.schedule.length; i++) {
            if (this.state.schedule[i][4] || this.state.schedule[i][10]) {
                days = [0, 1, 2, 3, 4, 5, 6]
                break;
            }
        }



        return (
        <div>
            <Editor schedule={this.state.schedule} 
            updateSchedule={this.updateTimeSlot} 
            addToSchedule = {this.addTimeSlot}
            removeFromSchedule = {this.removeTimeSlot}
            toggleWeekly = {this.toggleWeekly}
            weekly = {this.state.weekly}
            /> 
            
            {this.state.weekly ? 
                <WeeklySchedule days = {days} schedule={this.state.schedule} generateExample = {this.exampleSchedule}/> 
                : <DailySchedule schedule={this.state.schedule}/>
            }
        </div>
        //schedule is {[name, startTime, endTime, link, sun ... sat], ...}
        );
    } 
    
    
    updateTimeSlot = (timeSlot, i, newValue) => {
        var temp = this.state.schedule;
        temp[timeSlot][i] = newValue;
        this.setState({schedule: temp}, () => {this.saveSchedule()});
    }
    addTimeSlot = () => {
        var temp = this.state.schedule;
        temp.push(["","11:30","13:30","", false, false, false, false, false, false, false]);
        this.setState({schedule: temp}, () => {this.saveSchedule()});
    }
    removeTimeSlot = (i) => {
        var temp = this.state.schedule;
        temp.splice(i, 1);
        this.setState({schedule: temp}, () => {this.saveSchedule()});
    }
    toggleWeekly = (e) => {
        var temp = !this.state.weekly;
        this.setState({weekly: temp}, () => {this.saveSchedule()});
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

            if (i !== this.state.schedule.length - 1)
                strOutput += ">";
            }

            
            var urlParams;
            if (strOutput !== "") {
                urlParams = compressToBase64(strOutput);
            } else
                urlParams = "";
                
            const url = new URL(window.location);
            url.search = urlParams;
            window.history.pushState({}, '', url);

    }

    exampleSchedule = () => {
        var temp = [
            ["BIO 102", "10:15", "11:45", "Hall 102", false, true, false, true, false, true, false],
            ["AMS 201", "13:15", "14:40", "Engineering 112", false, false, true, false, true, false, false],
            ["MAT 144", "12:00", "13:00", "https://zoom.us/...", false, false, true, false, true, false, false],
            ["MUS 101", "08:30", "09:40", "https://zoom.us/...",  false, true, false, true, false, false, false],
            ["POL 181", "16:30", "17:20", "https://zoom.us/...",  false, true, false, false, false, false, false],
            ];

        this.setState({schedule: temp}, () => {this.saveSchedule()});
    }

    
}


export default App;
