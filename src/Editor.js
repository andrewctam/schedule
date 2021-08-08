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
                key = {index}
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


        var editor = (
        <div>
            <p className = "editorInfo"> {this.props.msg} </p>
            <div className = "editors">{timeSlotEditors}</div>
            <button className = "btn btn-primary" onClick={this.handleAdd}>Add Class</button>
            <hr/>
        </div>)
   
            
        return (<div className = "Editor">
             <div className = "row">
                <div className = "col-sm-6">
                    <Clock/>
                </div>
                <div className = "col-sm-6">
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
}

class Clock extends React.Component {
    render() {
    //Tue Aug 19 1975 23:15:30 GMT+0200 (CEST)
    var timeStr = new Date().toString();
    var date = timeStr.substring(0, 10);

    var hrs = parseInt(timeStr.substring(16, 18));
    var mins = timeStr.substring(19, 24);

    var meridian = hrs < 12 ? "AM" : "PM";

    if (hrs > 12)
        hrs %= 12;

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