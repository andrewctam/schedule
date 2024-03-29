import React from 'react';
import {ClassOnSchedule} from "../App.js"

class QuickActions extends React.Component {
    render() {
        return <div className = "quickActions">
            <h6>Click Edit Schedule above to add classes or click below to generate an example</h6>
            <button className = "btn btn-primary example randomScheduleButton" 
                onClick = {() => this.props.generateExample()}>
                Generate Example Schedule</button>
                <hr/>

            <h6>
                {"If you are a SBU student, you can copy and paste your schedule from your SOLAR."}
                <br/>
                {"Go to SOLAR > Student Records & Registration > Academic Planning > Enrollment Shopping Cart and scroll down. Highlight and copy the entire table."}
            </h6>
            <input id = "SOLAR" className = "SOLAR" onChange = {this.handleInput} placeholder="Paste Here"/>
        </div>
    }

    handleInput = (e) => {
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
                startTime = "";
                endTime = "";
                location = "ONLINE";
                daysOfWeek = [""]; 

            } else {
                startTime = this.AMPMto24H(timeInfo[0].substring(0, timeInfo[0].indexOf("-") - 1)) 
                endTime = this.AMPMto24H(timeInfo[0].substring(timeInfo[0].indexOf("-") + 2)) 
                location = stringArray[i].substring(timeInfo[0].length + timeInfo["index"], stringArray[i].search(/([A-Z]\. )|[Ss][Tt][Aa][Ff][Ff]/))
                daysOfWeek = stringArray[i].match(/\) (Su|Mo|Tu|We|Th|Fr|Sa){1,7} /)
            }

            schedule.push(new ClassOnSchedule(
                            stringArray[i].substring(0, 7),
                            startTime, 
                            endTime, 
                            location,
                            [daysOfWeek[0].includes("Su"),
                            daysOfWeek[0].includes("Mo"),
                            daysOfWeek[0].includes("Tu"),
                            daysOfWeek[0].includes("We"),
                            daysOfWeek[0].includes("Th"),
                            daysOfWeek[0].includes("Fr"),
                            daysOfWeek[0].includes("Sa")],
                            this.generateRandomColor())); 
        }
        console.log(schedule)
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

    generateRandomColor() {
        var hexa = ["A", "B", "C", "D", "E", "F"]
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += hexa[Math.floor(Math.random() * 6)];
        }
        return color;
    }
}

export default QuickActions;
