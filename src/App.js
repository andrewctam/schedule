import React from 'react';
import Schedule from './Schedule.js';
import Editor from './Editor.js';
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
            if (delim !== -1) {
                const timeSlots = savedSchedule.split('>');
                for (var i = 0; i < timeSlots.length; i++) {
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

        this.state = { schedule: scheduleFromLink };

    }
    render() {
        var msg;
        if (window.location.href.length >= 2000)
            msg = "Warning: The schedule link is too big (>2000 chars). If you have links, try using a link shortener like bit.ly to shorten the links";
        else if (this.state.schedule.length > 0)
            msg = "You can save your schedule by bookmarking this page or copying the link in the address bar";
        else
            msg = "Your schedule is currently empty. Click [Add Class] below to add a new class";
        

        return (
        <div>
            <Editor schedule={this.state.schedule} 
            updateSchedule={this.updateTimeSlot} 
            addToSchedule = {this.addTimeSlot}
            removeFromSchedule = {this.removeTimeSlot}
            msg = {msg}/> 
            <Schedule schedule={this.state.schedule}/> 
        </div>
        //schedule is {[name, startTime, endTime, sun ... sat], ...}
        );
    } 
    
    
    updateTimeSlot = (timeSlot, i, newValue) => {
        var temp = this.state.schedule;
        temp[timeSlot][i] = newValue;
        this.setState({schedule: temp});
        this.saveSchedule();
    }

    addTimeSlot = () => {
        var temp = this.state.schedule;
        temp.push(["","","","", false, false, false, false, false, false, false]);
        this.setState({schedule: temp});
        this.saveSchedule();
    }
    removeTimeSlot = (i) => {
        var temp = this.state.schedule;
        temp.splice(i, 1);
        this.setState({schedule: temp});
        this.saveSchedule();
    }

    saveSchedule = () => {
        var strOutput = "";
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

    
}


export default App;
