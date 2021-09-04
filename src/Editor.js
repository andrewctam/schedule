import React from 'react';
import TimeSlotEditor from './TimeSlotEditor.js'

class Editor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editorActive: false,
            showAddToHomeScreen: (localStorage.getItem("showAddToHomeScreen") !== "false") && 
                                 (navigator.userAgent.match(/iPhone/i) ||
                                  navigator.userAgent.match(/Android/i) ||
                                  navigator.userAgent.match(/webOS/i) ||
                                  navigator.userAgent.match(/iPad/i)  ||
                                  navigator.userAgent.match(/iPod/i) 
                                )
        }
    }

    render() {
        var userInPWA = window.matchMedia('(display-mode: standalone)').matches;

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

    
        if (this.props.link >= 2000)
            var msg = <p className = "editorInfo">{"Warning: The schedule link is too big (>2000 chars). If you have links, try using a link shortener like bit.ly to shorten the links"}</p>;
        else if (this.props.schedule.length > 0)
            msg = (<div className = "editorInfo">
                    <h1>Information</h1>
                    <ul>
                        {
                        userInPWA ? 
                        <li style = {{backgroundColor: "rgb(255, 200, 200)"}}>
                            <p>{"WARNING: Your schedule and any new edits are automatically saved, but if you clear your browser's history/cookies, any changes to your schedule made after you first added the app may be deleted."}</p>
                            <p>{"To guarantee that your changes are not deleted: once you finish your edits, go to the link below in your web browser and re-add this app to the home screen (and you can delete the old one)."}</p>
                        </li>
                        :
                        <li><p>{"You can save your schedule by bookmarking this page (or save it directly to your home screen on your mobile device, which will make it an app) or by copying and saving the link below (same as link in address bar)"}</p></li>
                        }
                        <li><input className = "linkResult" inputMode = "none" onClick = {this.handleSelect} value = {this.props.link} /></li>
                        <li><p>{(this.props.weekly ? " If you click on a block in the schedule, it will open a box at the top of the page with full information about the class. If the class has a link, clicking on this box will open the link in a new tab " :
                                                    "If you click on a class and it has a link, the link will open in a new tab")}</p></li>
                        <li><p>{(this.props.weekly ? " If you want your schedule to display earlier or later times, you can create an new class and set the start and end times to your desired times, but leave all the other inputs empty" :  
                                                        "Classes will only show in the list on days that the class meets on.")}</p></li>
                    </ul>
                    </div>);
        else
            msg = <p className = "editorInfo">{"Your schedule is currently empty. Click [Add Class] below to add a new class"}</p>;

        var editor = (
        <div>
            {msg}
            <div className="form-check form-switch">
                <input className="form-check-input" onChange = {this.handleChecked} checked = {this.props.weekly} type="checkbox" id="weeklyToggle" />
                <label className="form-check-label" htmlFor="weeklyToggle">Weekly Schedule (on) or Daily Schedule (off)</label>
            </div>
            <div className = "editors"><hr />{timeSlotEditors}</div>
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
                    onClick = {this.toggleAndVerify}>
                        {this.state.editorActive ? "Close Editor" : "Edit Schedule"}  
                    </button>
                </div>
             </div>
                
            {!userInPWA && this.state.showAddToHomeScreen && this.props.schedule.length > 0 ? 
            <div style = {{backgroundColor: "rgb(255, 200, 200)"}} className = "row editorInfo">
                <p>{"You can save this app to your mobile device's homescreen and save it as an app, allowing this app to work offline and be accessed in the app switcher."}</p> 
                <ul><li>On iOS on Safari, click the Share icon (box with up arrow) and select Add To Home Screen.</li>
                <li>On Android on Chrome, open the three dots menu and select Add To Home Screen.</li>
                </ul>
            <button className = "btn btn-light" onClick = {this.handleHide}>Close Message</button></div> 
            : null}

            
            {this.state.editorActive ? editor : <hr/>} 
            </div>);
    }
  
    handleHide = (e) => {
        localStorage.setItem("showAddToHomeScreen", "false");
        this.setState({showAddToHomeScreen: false});
    }
    
    handleSelect = (e) => {
        e.target.select();

    }
    handleAdd = (e) => {
        this.props.addToSchedule();
    }

    handleChecked = (e) => {
        this.props.toggleWeekly();
    }

    stringToDate = (str) => {
        var hrs = str.substring(0, 2);
        var mins = str.substring(3, 5);
        var time = new Date();
        time.setHours(parseInt(hrs));
        time.setMinutes(parseInt(mins));
        time.setSeconds(0);
        return time;
    }
    

    toggleAndVerify = () => {
        if (this.state.editorActive)
            for (var i = 0; i < this.props.schedule.length; i++) {
                if (this.stringToDate(this.props.schedule[i][2]) < this.stringToDate(this.props.schedule[i][1])) {
                    if (this.props.schedule[i][0] === "") 
                        switch (i + 1) {
                            case 1:
                                var identifier = "the " + (i + 1) + "st class";
                                break;
                            case 2:
                                identifier = "the " + (i + 1) + "nd class";
                                break;
                            case 3:
                                identifier = "the " + (i + 1) + "rd class";
                                break;
                            default:
                                identifier = "the " + (i + 1) + "th class";
                                break;
                        }
                    else
                        identifier = this.props.schedule[i][0];

                    if (window.confirm("The end time of " + identifier + " is before the start time. Would you like to close the editor anyway?"))  {
                        this.setState({editorActive: false});
                        return null;
                    } else
                        return null;
                } 
                
                
            }

        this.setState({editorActive: !this.state.editorActive})

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