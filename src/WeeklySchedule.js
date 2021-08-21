import React from 'react';

class WeeklySchedule extends React.Component {
    render() {
        //name-startTime-endTime-example.com-0-1-2-3-4-5-6&

        var startHr = 24;
        var endHr = 0;
        var hours = [];



        for (var j = 0; j < this.props.schedule.length; j++) {      
            for (var k = 0; k < 7; k++)
                if (this.props.schedule[j][k + 4]) {
                var start = this.stringToDate(this.props.schedule[j][1]);
                var end = this.stringToDate(this.props.schedule[j][2]);
                
                if (start.getHours() < startHr) {
                    startHr = start.getHours();
                }
                if (end.getHours() > endHr) {
                    endHr = end.getHours();
                }
            }
        }
        
        var blocks = [];

        for (var j = 0; j < this.props.schedule.length; j++) {      
            for (var k = 0; k < 7; k++)
                if (this.props.schedule[j][k + 4]) {
                    var start = this.stringToDate(this.props.schedule[j][1]);
                    var end = this.stringToDate(this.props.schedule[j][2]);
                    var lengthInMins = (end.getHours() - start.getHours()) * 60 + end.getMinutes() - start.getMinutes();
                    
                    var block = <div id={j} className = "block" onClick = {this.handleClick} style = {
                    {
                        height: lengthInMins + "px",
                        top: start.getHours() * 60 + start.getMinutes() - (startHr - 1) * 60 + "px",
                        left: 12.5 * (k + 1) + "%",
                    }}><p className = "text-center text-truncate text-wrap">{this.props.schedule[j][0]}</p>
                    </div>
                    blocks.push(block);
                }
        }

        for (var i = startHr; i <= endHr; i++) {
            hours.push(<Hour time = {i} />)
        }

        return (
            <div className = "weekly">
                <table className = "table">
                <thead>
                    <tr>
                        <th scope="col">Time</th>
                        <th scope="col">Sun</th>
                        <th scope="col">Mon</th>
                        <th scope="col">Tue</th>
                        <th scope="col">Wed</th>
                        <th scope="col">Thu</th>
                        <th scope="col">Fri</th>
                        <th scope="col">Sat</th>
                    </tr>
                    </thead>
                            {hours}
                            {blocks}
                            <CurrentTime startHr = {startHr} endHr = {endHr} />
                    </table>

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
        console.log(e.target)
        var link = this.props.schedule[parseInt(e.target.id)][3];

        if (link.includes(".") && (link.includes("http://") || link.includes("https://"))) {
            try {
                window.open(new URL(link), '_blank').focus();
            } catch (_) {
                alert(link);
            }
        }
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
                    <th scope="row" style = {{verticalAlign: "top"}}>{hrs + " " + meridian }</th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>

                    <td></td>
                    <td></td>
                    <td></td>
                </tr>

        )
    }
}

class CurrentTime extends React.Component {
    render() {
        var now = new Date();
        if (now > this.intToDate(this.props.startHr) && now < this.intToDate(this.props.endHr))
            return <div id = "currentTime" className = "line" onClick = {this.handleClick} style = {
                    {
                        top: now.getHours() * 60 + now.getMinutes() - (this.props.startHr - 1) * 60 + "px",
                    }} />
        else 
            console.log("a");
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
    
    handleClick() {
        document.getElementById("currentTime").style.display = "none";
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
export default WeeklySchedule;
