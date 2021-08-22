import React from 'react';

class WeeklySchedule extends React.Component {
    render() {
        //name-startTime-endTime-example.com-0-1-2-3-4-5-6&
        //determine what is the earliest class and what is the latest class
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
        
        //create blocks for each class
        var blocks = [];
        for (var j = 0; j < this.props.schedule.length; j++) {      
            var start = this.stringToDate(this.props.schedule[j][1]);
            var end = this.stringToDate(this.props.schedule[j][2]);
            var lengthInMins = (end.getHours() - start.getHours()) * 60 + end.getMinutes() - start.getMinutes();
            
            for (var k = 0; k < 7; k++)
                if (this.props.schedule[j][k + 4]) {
                    
                    var block = <div id={j} className = "block" onClick = {this.handleClick} style = {
                    {
                        height: lengthInMins + "px",
                        top: 3 + start.getHours() * 60 + start.getMinutes() - (startHr - 1) * 60 + "px", //+3 for borders
                        left: 12.5 * (k + 1) + "%",
                    }}><p className = "text-center text-truncate text-wrap">{this.props.schedule[j][0]} <br/> {this.props.schedule[j][3]}</p>
                    </div>
                    blocks.push(block);
                }
        }

        //create the hours 
        for (var i = startHr; i <= endHr; i++) {
            hours.push(<Hour time = {i} />)
        }

        return (
            <div className = "weekly">
                <table className = "table">
                <thead>
                    <tr>
                        <th scope="col">Time</th>
                        <th scope="col"><p style = {{color: new Date().getDay() === 0 ? "red" : "black"}} >Sun</p></th>
                        <th scope="col"><p style = {{color: new Date().getDay() === 1 ? "red" : "black"}} >Mon</p></th>
                        <th scope="col"><p style = {{color: new Date().getDay() === 2 ? "red" : "black"}} >Tue</p></th>
                        <th scope="col"><p style = {{color: new Date().getDay() === 3 ? "red" : "black"}} >Wed</p></th>
                        <th scope="col"><p style = {{color: new Date().getDay() === 4 ? "red" : "black"}} >Thu</p></th>
                        <th scope="col"><p style = {{color: new Date().getDay() === 5 ? "red" : "black"}} >Fri</p></th>
                        <th scope="col"><p style = {{color: new Date().getDay() === 6 ? "red" : "black"}} >Sat</p></th>
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
        var link = this.props.schedule[parseInt(e.target.id)][3];

        if (link.includes(".") && (link.includes("http://") || link.includes("https://"))) {
            if (window.confirm("Open the link? " + link))

            try {
                window.open(new URL(link), '_blank').focus();
            } catch (_) {
                alert(link);
            }
        } else alert(link)
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
        if (now > this.intToDate(this.props.startHr) && now < this.intToDate(this.props.endHr))
            return <div id = "currentTime" className = "line" onClick = {this.handleClick} style = {
                    {
                        top: now.getHours() * 60 + now.getMinutes() - (this.props.startHr - 1) * 60 + "px",
                    }} />
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
