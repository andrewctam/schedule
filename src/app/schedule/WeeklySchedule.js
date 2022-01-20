import React from 'react';
import TimeSlot from './TimeSlot.js';
import QuickActions from './QuickActions.js';

class WeeklySchedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {timeSlot: null};
    }
    render() {
        if (this.props.schedule.length === 0)
            return (<QuickActions 
                generateExample = {this.props.generateExample}
                updateEntireSchedule = {this.props.updateEntireSchedule}/>);

        document.documentElement.style.setProperty("--numDays", (100 / (this.props.days.length + 1)) + "%");
        //name-startTime-endTime-example.com-0-1-2-3-4-5-6&
        //determine what is the earliest class and what is the latest class
        var startHr = 24;
        var endHr = 0;
        for (var i = 0; i < this.props.schedule.length; i++) {
            var start = this.props.schedule[i].startTimeDate;
            var end = this.props.schedule[i].endTimeDate;
            
            if (start.getHours() < startHr) {
                startHr = start.getHours();
            }
            if (end.getHours() > endHr) {
                endHr = end.getHours();
            }
        }
        //create blocks for each class
        var blocks = [];
        for (i = 0; i < this.props.schedule.length; i++) {      
            start = this.props.schedule[i].startTimeDate;
            end = this.props.schedule[i].endTimeDate;
            var lengthInMins = (end.getHours() - start.getHours()) * 60 + end.getMinutes() - start.getMinutes();
            
            for (var j = 0; j < this.props.days.length; j++)
                if (this.props.schedule[i].days[this.props.days[j]]) {
                    blocks.push(
                        <div key = {"block" + i + "on" + j} id={i} className = "block" onClick = {this.handleClick} style = {
                            {
                                height: lengthInMins + "px",
                                top: start.getHours() * 60 + start.getMinutes() - (startHr - 1) * 60 + "px",
                                left: (100 / (this.props.days.length + 1)) * (j + 1) + "%",
                                backgroundColor: this.props.schedule[i].color,
                                color: this.darkOrWhiteText(this.props.schedule[i].color),
                            }}>
                                
                            <p className = "text-center text-truncate text-wrap">{this.props.schedule[i].name}</p>
                            <p className = "text-center text-truncate text-wrap">{this.props.schedule[i].location}</p>
                        </div>);
                }
            }
            
        //create the hours 
        var hours = [];
        for (i = startHr; i <= endHr; i++) {
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
                <CurrentTime key = "currentTime" days = {this.props.days} schedule = {this.props.schedule} startHr = {startHr} endHr = {endHr} />
            </div>
        );
    }


    handleClick = (e) => {
        var timeSlot = <TimeSlot
        addPadding = {true}
        when = {"classInFuture"}
        name = {this.props.schedule[e.target.id].name}       info = {this.props.schedule[e.target.id].location}
        startTime = {this.props.schedule[e.target.id].startTime}  endTime = {this.props.schedule[e.target.id].endTime}
        />;

        this.setState({timeSlot:
            <div className = "fixed-bottom">
                {timeSlot}
            </div>
        })


    }
    darkOrWhiteText(bkColor) { //#123456
        var brightness = Math.round((
                    (Number("0x" + bkColor.substring(1, 3)) * 299) +
                    (Number("0x" + bkColor.substring(3, 5)) * 587) +
                    (Number("0x" + bkColor.substring(5)) * 114)) / 1000);
        return (brightness > 125) ? 'black' : 'white';

    }
    
}

class Hour extends React.Component {
    render() {
        var hrs = this.props.time;

        if (isNaN(hrs)) {
            var meridian = "";
        } else {
            meridian = hrs < 12 ? "AM" : "PM";
            if (hrs > 12) {
                hrs %= 12;
            } else if (hrs === 0) {
                hrs = 12;
            }
        }
        
        var daysOfWeek = []
        for ( var i = 0; i < this.props.numOfDays; i++) {
            daysOfWeek.push(<td key = {this.props.time + "," + i} />) 
        }

        return (
                <tr>
                    <th scope = "row" style = {{verticalAlign: "top"}}>
                        <p>{hrs + " " + meridian}</p>
                    </th>
                    {daysOfWeek}
                </tr>

        )
    }
}

class CurrentTime extends React.Component {
    render() {
        var now = new Date();
        var leastTimeToNextClass = -1;
 
        for (var i = 0; i < this.props.schedule.length; i++) {      
            var start = this.props.schedule[i].startTimeDate;
            var end = this.props.schedule[i].endTimeDate;
            if (this.props.schedule[i].days[now.getDay()]) {
                if (now < start) {
                    var timeToNextClass = ((start - now) / 60000);
                    if (timeToNextClass < leastTimeToNextClass || leastTimeToNextClass === -1)
                    leastTimeToNextClass = timeToNextClass;

                } else if (now < end) { //in middle of a class
                    leastTimeToNextClass = -1;
                    break;
                }
            }

        }

        for (i = 0; i < this.props.days.length; i++) {
            if (new Date().getDay() === this.props.days[i]) {
                var date = i + 1;
                break;
            }
        }

        if (this.props.days.indexOf(new Date().getDay()) !== -1 && now > this.intToDate(this.props.startHr) && now < this.intToDate(this.props.endHr + 1))
            return <div id = "currentTime" className = "line" onClick = {this.handleClick} style = {
                    {
                        top: now.getHours() * 60 + now.getMinutes() - (this.props.startHr - 1) * 60 - 28 + "px",
                        left: (date * (100 / (this.props.days.length + 1))) + "%",
                    }}>
                    <p>{(leastTimeToNextClass !== -1 ? this.formatMinutes(leastTimeToNextClass) : "")}&#8204;</p>
                </div>
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
    formatMinutes = (num) => {
        var mins = Math.ceil(num);
        var hrs = Math.floor(mins / 60);
        mins = mins % 60;

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
