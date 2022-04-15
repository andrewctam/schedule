import React from "react";

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

export default CurrentTime;