import React from 'react';
import TimeSlot from './TimeSlot.js';
import TimeBlock from './weekly/TimeBlock.js';
import Hour from './weekly/Hour.js';
import CurrentTime from './weekly/CurrentTime.js';

class WeeklySchedule extends React.Component {
    constructor(props) {
        super(props);

        var now = new Date();
        for (var i = 0; i < this.props.schedule.length; i++) {      
            if (this.props.schedule[i].days[now.getDay()] &&
                this.props.schedule[i].startTimeDate < now &&
                now < this.props.schedule[i].endTimeDate) {

                this.state = {timeSlot: 
                    <div className = "fixed-bottom">
                        <TimeSlot
                        addPadding = {true}
                        when = {"classInFuture"}
                        name = {this.props.schedule[i].name}       
                        location = {this.props.schedule[i].location}
                        startTime = {this.props.schedule[i].startTime}  
                        endTime = {this.props.schedule[i].endTime}
                        /> 
                    </div>};

                return;
            }
        }
        
        this.state = {timeSlot: null};
    }

    render() {
        //name-startTime-endTime-example.com-0-1-2-3-4-5-6&
        //determine what is the earliest class and what is the latest class
        var scheduleStart = 24;
        var scheduleEnd = 0;
        for (var i = 0; i < this.props.schedule.length; i++) {
            var classStart = this.props.schedule[i].startTimeDate;
            var classEnd = this.props.schedule[i].endTimeDate;
            
            if (classStart.getHours() < scheduleStart) {
                scheduleStart = classStart.getHours();
            }
            if (classEnd.getHours() > scheduleEnd) {
                scheduleEnd = classEnd.getHours();
            }
        }

        //create blocks for each class
        var blocks = [];
        for (i = 0; i < this.props.schedule.length; i++) {      
            classStart = this.props.schedule[i].startTimeDate;
            classEnd = this.props.schedule[i].endTimeDate;
            var lengthInMins = (classEnd.getHours() - classStart.getHours()) * 60 + classEnd.getMinutes() - classStart.getMinutes();
            console.log(this.props.schedule)

            for (var j = 0; j < this.props.days.length; j++) {
                if (this.props.schedule[i].days[this.props.days[j]]) {
                    blocks.push(
                    <TimeBlock
                        height = {lengthInMins}
                        classStart = {classStart}
                        scheduleStart = {scheduleStart}
                        days = {this.props.days}
                        schedule = {this.props.schedule}
                        showTimeSlot = {this.showTimeSlot}
                        i = {i}
                        j = {j}

                        key = {i + ":" + j}
                    />);
                }
            }
        }
            
        var hours = [];
        for (i = scheduleStart; i <= scheduleEnd; i++) {
            hours.push(<Hour key = {"hr" + i} time = {i} numOfDays = {this.props.days.length} />);
        }

        var daysHeader = [<th key = "time" scope="col">  <p>Time</p>  </th>];
        var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        for (i = 0; i < this.props.days.length; i++) {
            daysHeader.push(
            <th key = {"day" + i} scope="col"> 
                <p>{days[this.props.days[i]]}</p>  
            </th>);
        } 

        return (
            <div className = "weekly">
                <table className = "table">
                    <thead onClick = {() => this.setState({timeSlot: null})} >
                        <tr>{daysHeader}</tr>
                    </thead>
                    <tbody onClick = {() => this.setState({timeSlot: null})}>
                        {hours}
                    </tbody>
                </table>
                
                {this.state.timeSlot}
                {blocks}
                <CurrentTime key = "currentTime" days = {this.props.days} schedule = {this.props.schedule} startHr = {scheduleStart} endHr = {scheduleEnd} />
            </div>
        );
    }


    showTimeSlot = (ts) => {
        this.setState({timeSlot:
            <div className = "fixed-bottom">
                <TimeSlot
                addPadding = {true}
                when = {"classInFuture"}
                name = {this.props.schedule[ts].name}       
                location = {this.props.schedule[ts].location}
                startTime = {this.props.schedule[ts].startTime}  
                endTime = {this.props.schedule[ts].endTime}
                />
            </div>
        })


    }
    
    
}


export default WeeklySchedule;
