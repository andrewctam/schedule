import React from 'react';
import TimeSlot from './TimeSlot.js';

class WeeklySchedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {timeSlot: null} 
    }
    render() {
        //name-startTime-endTime-example.com-0-1-2-3-4-5-6&
        //determine what is the earliest class and what is the latest class
        var startHr = 24;
        var endHr = 0;
        var hours = [];
        for (var i = 0; i < this.props.schedule.length; i++) {      
            var start = this.stringToDate(this.props.schedule[i][1]);
            var end = this.stringToDate(this.props.schedule[i][2]);
            if (start.getHours() < startHr) {
                startHr = start.getHours();
            }
            if (end.getHours() > endHr) {
                endHr = end.getHours();
            }
        }
        
        //create blocks for each class
        var blocks = [];
        for (var i = 0; i < this.props.schedule.length; i++) {      
            var start = this.stringToDate(this.props.schedule[i][1]);
            var end = this.stringToDate(this.props.schedule[i][2]);
            var lengthInMins = (end.getHours() - start.getHours()) * 60 + end.getMinutes() - start.getMinutes();
            
            for (var j = 0; j < 7; j++)
                if (this.props.schedule[i][j + 4]) {
                    blocks.push(
                    <div id={i} className = "block" onClick = {this.handleClick} style = {
                        {
                            height: lengthInMins + "px",
                            top: start.getHours() * 60 + start.getMinutes() - (startHr - 1) * 60 + "px",
                            left: 12.5 * (j + 1) + "%",
                        }}>
                            
                        <p className = "text-center text-truncate text-wrap">{this.props.schedule[i][0]}</p>
                        <p className = "text-center text-truncate text-wrap">{this.props.schedule[i][3]}</p>
                    </div>);
                }
        }

        //create the hours 
        for (var i = startHr; i <= endHr; i++) {
            hours.push(<Hour time = {i} />)
        }

        
        if (this.props.schedule.length === 0)
            return (<h1>Click [Edit Schedule] Above to Add Classes</h1>)



        return (<div>
            <div className = "weekly">
            {this.state.timeSlot}
                <table className = "table" >
                    <thead onClick = {() => this.setState({timeSlot: null})} >
                        <tr>
                            <th scope="col"><p>Time</p></th>
                            <th scope="col"><p>Sun</p></th>
                            <th scope="col"><p>Mon</p></th>
                            <th scope="col"><p>Tue</p></th>
                            <th scope="col"><p>Wed</p></th>
                            <th scope="col"><p>Thu</p></th>
                            <th scope="col"><p>Fri</p></th>
                            <th scope="col"><p>Sat</p></th>
                        </tr>
                    </thead>

                    <tbody onClick = {() => this.setState({timeSlot: null})}>
                        {hours}
                    </tbody>
                    
                    {blocks}
                    <CurrentTime schedule = {this.props.schedule} startHr = {startHr} endHr = {endHr} />
                </table>
                </div>
            </div>
        );
    }

    stringToDate = (str) => {
        if (str!= null) {
            var hrs = str.substring(0, 2);
            var mins = str.substring(3, 5);
            var time = new Date();
            time.setHours(parseInt(hrs));
            time.setMinutes(parseInt(mins));
            time.setSeconds(0);
            return time;
        }
    }

    handleClick = (e) => {

        this.setState({timeSlot:
             <TimeSlot
             when = {"classInFuture"}
            name = {this.props.schedule[e.target.id][0]}       info = {this.props.schedule[e.target.id][3]}
            startTime = {this.props.schedule[e.target.id][1]}  endTime = {this.props.schedule[e.target.id][2]}
            />
        })


    }
    
}

class Hour extends React.Component {
    render() {

        var hrs = this.props.time;

        if (isNaN(hrs)) {
            var meridian = "";
        } else {
            var meridian = hrs < 12 ? "AM" : "PM";

            if (hrs > 12) {
                hrs %= 12;
            } else if (hrs === 0) {
                hrs = 12;
            }
        }


        return (
                <tr>
                    <th scope="row" style = {{verticalAlign: "top"}}><p>{hrs + " " + meridian }</p></th>
                    <td/>
                    <td/>
                    <td/>
                    <td/>
                    <td/>
                    <td/>
                    <td/>
                    
                </tr>

        )
    }
}

class CurrentTime extends React.Component {
    render() {
        var now = new Date();
        var timeToNextClass = -1;
 
        for (var i = 0; i < this.props.schedule.length; i++) {      
            var start = this.stringToDate(this.props.schedule[i][1]);
            var end = this.stringToDate(this.props.schedule[i][2]);
            if (this.props.schedule[i][now.getDay() + 4] && now < start) {
                timeToNextClass = (start - now) / 60000;
            }

        }

        if (now > this.intToDate(this.props.startHr) && now < this.intToDate(this.props.endHr + 1))
            return <div id = "currentTime" className = "line" onClick = {this.handleClick} style = {
                    {
                        top: now.getHours() * 60 + now.getMinutes() - (this.props.startHr - 1) * 60 - 28 + "px",
                        left: 12.5 + (new Date().getDay() * 12.5) + "%",
                    }}><p>{(timeToNextClass !== -1 ? this.formatMinutes(timeToNextClass) : "")}&#8204;</p></div>
        else 
            return null;
    }
    
    intToDate = (num) => {
        if (!isNaN(num)) {
            var time = new Date();
            time.setHours(num);
            time.setMinutes(0);
            time.setSeconds(0);
            return time;
        }
    }

    stringToDate = (str) => {
        if (str != null) {
            var hrs = str.substring(0, 2);
            var mins = str.substring(3, 5);
            var time = new Date();
            time.setHours(parseInt(hrs));
            time.setMinutes(parseInt(mins));
            time.setSeconds(0);
            return time;
        }
    }
    
    formatMinutes = (num) => {
        var mins = Math.floor(num);
        var hrs = Math.floor(mins / 60);
        var mins = mins % 60;

        var minuteWord = mins === 1 ? " min" : " mins";
        var hourWord = hrs === 1 ? " hour" : " hours";

        if (hrs === 0) {
            return mins + minuteWord; 
        } else
            return hrs + hourWord + " " + mins + minuteWord;
            
    }
    
    handleClick = () => {
        document.getElementById("currentTime").style.display = "none";
        this.hide = setInterval(() => this.show(), 5000);
    }


    show = () => {
        document.getElementById("currentTime").style.display = "table";
        clearInterval(this.hide);

    }

    componentDidMount() {
        var timeToNextMinute = 61000 - (new Date().getSeconds() * 1000);
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
        clearInterval(this.hide);

    }
}
export default WeeklySchedule;
