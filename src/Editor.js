import React from 'react';
import TimeSlotEditor from './TimeSlotEditor.js'

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorActive: false,
        }
    }

    render() {
        var timeSlotEditors = this.props.schedule.map((timeSlot, index) => 
            <TimeSlotEditor
                key = {"tse" + index}
                id = {index}
                updateSchedule={this.props.updateSchedule}
                removeFromSchedule={this.props.removeFromSchedule}
                name = {timeSlot[0]}
                startTime = {timeSlot[1]}
                endTime = {timeSlot[2]}
                info = {timeSlot[3]}
                sun = {timeSlot[4]}
                mon = {timeSlot[5]}
                tue = {timeSlot[6]}
                wed = {timeSlot[7]}
                thu = {timeSlot[8]}
                fri = {timeSlot[9]}
                sat = {timeSlot[10]}
            />);

        var msg;
        if (window.location.href.length >= 2000)
            msg = <p className = "editorInfo">{"Warning: The schedule link is too big (>2000 chars). If you have links, try using a link shortener like bit.ly to shorten the links"}</p>;
        else if (this.props.schedule.length > 0)
            msg = <p className = "editorInfo">{"You can save your schedule by bookmarking this page or copying "} <a href = {window.location.href}>{"this link"}</a>{" (same as link in address bar)"}</p>;
        else
            msg = <p className = "editorInfo">{"Your schedule is currently empty. Click [Add Class] below to add a new class"}</p>;

        var editor = (
        <div>
            <div className="form-check form-switch">
                <input className="form-check-input" onChange = {this.handleChecked} checked = {this.props.weekly} type="checkbox" id="weeklyToggle" />
                <label className="form-check-label" htmlFor="weeklyToggle">Weekly View</label>

                
            </div>


            {msg}
            <div className = "editors">{timeSlotEditors}</div>
            <button className = "btn btn-primary" onClick={this.handleAdd}>Add Class</button>
            <hr/>
            
        </div>)
   
            
        return (<div className = "Editor">
             <div className = "row">
                <div className = "col-sm-6">
                    <Clock/>
                </div>
                <div className = "col-sm-6 editSchedule">
                    <button type = "button" className = "btn btn-secondary" 
                    onClick = {() => this.setState({editorActive: !this.state.editorActive})}>
                        {this.state.editorActive ? "Close Editor" : "Edit Schedule"}  
                    </button>
                </div>

                

             </div>

            {this.state.editorActive ? editor : <hr/>} 
            </div>);
    }
  
    handleAdd = (e) => {
        this.props.addToSchedule();
    }

    handleChecked = (e) => {
        this.props.toggleWeekly();
    }
}

class Clock extends React.Component {
    render() {
    //Tue Aug 19 1975 23:15:30 GMT+0200 (CEST)
    var timeStr = new Date().toString();
    var date = timeStr.substring(0, 10);

    var hrs = parseInt(timeStr.substring(16, 18));
    var mins = timeStr.substring(19, 24);

    var meridian = hrs < 12 ? "AM" : "PM";

    if (hrs > 12) {
        hrs %= 12;
    } else if (hrs === 0) {
        hrs = 12;
    }

    return (<button type = "button" className = "btn btn-secondary">
            {date + " - " + hrs + ":" + mins + " " + meridian}</button>);   
    }

    componentDidMount() {
        this.waitForNextSecond = setInterval(() => 
        this.repeatEverySecond(), 
        1000 - new Date().getMilliseconds());

    }
    
    repeatEverySecond() {
        clearInterval(this.waitForNextSecond);
        this.forceUpdate();
        this.interval = setInterval(() => this.forceUpdate(), 1000);
    }

    
    componentWillUnmount() {
        clearInterval(this.interval);
        clearInterval(this.waitForNextSecond);
    }
}

export default Editor; 