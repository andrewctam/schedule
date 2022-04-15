import React from 'react';
import Editor from './Editor.js'

class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editorsActive: false,
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
        
        if (this.props.link.length >= 2000)
            var msg = <Message msg = {"link too long"}/>
        else if (this.props.schedule.length > 0)
            msg = <Message msg = {"schedule info"} userInPWA = {userInPWA} link = {this.props.link} weekly = {this.props.weekly}/>
        else
            msg = <Message msg = {"schedule empty"}/>
            
        //convert the schedule into time slot editors  
            
        return (<div className = "Settings">
             <div className = "row">
                <div className = "col-sm-6">
                    <Clock/>
                </div>
                <div className = "col-sm-6 editSchedule">
                    <button type = "button" className = "btn btn-secondary" 
                        onClick = {this.toggleAndVerify}>
                        {this.state.editorsActive ? "Save and Close Editor" : "Edit Schedule"}  
                    </button>
                </div>
             </div>
                
            {!userInPWA && this.state.showAddToHomeScreen && this.props.schedule.length > 0 &&
                <Message msg = {"show add to home screen"} handleHide = {this.handleHide} />
            }
        
            {this.state.editorsActive ?
                <div>
                    {msg}
                    {this.props.schedule.length > 0 && 
                    <div>
                        <div className="form-check form-switch">
                            <input className="form-check-input" onChange = {this.handleChecked} checked = {this.props.weekly} type="checkbox" id="weeklyToggle" />
                            <label className="form-check-label" htmlFor="weeklyToggle">{this.props.weekly ? "Displaying Weekly Schedule" : "Displaying Daily Schedule"}</label>
                        </div>
                        <Editors 
                        schedule = {this.props.schedule}   
                        updateClass={this.props.updateClass}
                        removeClass={this.props.removeClass}
                        />
                    </div> 
                    }

                    <button className = "btn btn-primary" onClick={this.handleAdd}>Add Class</button>


                    {this.props.schedule.length > 0 ? 
                    (
                        <div>
                            {this.props.weekly ?
                                <button className = "btn btn-secondary" onClick={this.props.randomizeColors}>Randomize Colors</button>  : null
                            }
                            

                            <button className = "btn btn-secondary" onClick = {this.clearSchedule}> Clear Schedule</button>
                        </div>
                    ) : null
                    }
                    
                    <hr/>
                    
                    </div> 
                : <hr/>
            } 
            </div>);
    }
  
    handleHide = (e) => {
        localStorage.setItem("showAddToHomeScreen", "false");
        this.setState({showAddToHomeScreen: false});
    }
    
  
    handleAdd = (e) => {
        this.props.addEmptyClass();
    }

    handleChecked = (e) => {
        this.props.toggleWeekly();
    }

    clearSchedule = () => {
        if(window.confirm("Are you sure you want to clear your schedule?")) {
            this.props.updateEntireSchedule( [] );
        }
    }

    
    //show/hide the editor when pressed and verify all the start times are before the end times
    toggleAndVerify = () => {
        if (this.state.editorsActive) {
            if (this.props.link.length >= 2000) {
                alert("Your schedule is too large. Try to reduce link sizes.");
                return null;
            }

            for (var i = 0; i < this.props.schedule.length; i++) {
 
                if (this.props.schedule[i].startTimeDate > this.props.schedule[i].endTimeDate)  {
                    if (this.props.schedule[i].name === "") 
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
                        identifier = this.props.schedule[i].name;

                    if (!window.confirm("The end time of " + identifier + " is before the start time. Would you like to close the editor anyway?"))  { 
                        return null;
                    } 

                }
            }  
            this.props.updateURL();
            this.setState({editorsActive: false});
        } else 
            this.setState({editorsActive: true});

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

        return (<button type = "button" className = "btn btn-secondary clock">
                {date + " - " + hrs + ":" + mins + " " + meridian}
                </button>);   
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

class Message extends React.Component {
    render() {
        switch (this.props.msg) {
            case ("show add to home screen"):
                return <div style = {{backgroundColor: "rgb(255, 200, 200)", color: "black"}} className = "row editorInfo">
                        <p>{"You can save this app to your mobile device's homescreen and save it as an app, allowing this app to work offline and be accessed in the app switcher."}</p> 
                        <ul><li>On iOS on Safari, click the Share icon (box with up arrow) and select Add To Home Screen.</li>
                        <li>On Android on Chrome, open the three dots menu and select Add To Home Screen.</li>
                        </ul>
                        <button className = "btn btn-light" onClick = {this.props.handleHide}>Close Message</button></div>
            case ("link too long"):
                return <p className = "editorInfo">{"Warning: Your schedule is too large to be saved. If you have links, try using a link shortener like bit.ly to shorten the links"}</p>;
            case ("schedule empty"):
                return <p className = "editorInfo">{"Your schedule is currently empty. Click Add Class below to add a new class"}</p>;
            case ("schedule info"):
                return (<div className = "editorInfo">
                            <ul>
                                {
                                this.props.userInPWA ? 
                                <li>
                                    {"To guarantee that your changes are not deleted: once you finish your edits, go to the link below in your web browser and re-add this app to the home screen (and you can delete the old one)."}
                                </li>

                                :<div>
                                <li>{"To discard your changes, refresh the page."}</li>
                                <li>{"To save your schedule, click Save and Close Editor and bookmark/favorite this page"}</li>
                                <li>{"You can also save your schedule by copying this URL:"}</li>
                                </div>}
        
                                <li><input className = "linkResult" inputMode = "none" onClick = {this.handleSelect} value = {this.props.link} readOnly = {true} /></li>
                            </ul>
                        </div>);
            default:
                return null;
        }
    }
    handleSelect = (e) => {
        e.target.select();
    }
    
}

class Editors extends React.Component {
    render() {
        var editors = this.props.schedule.map((timeSlot, index) => 
        <Editor
            key = {"e" + index}
            id = {index}
            updateClass={this.props.updateClass}
            removeClass={this.props.removeClass}
            name = {timeSlot.name}
            startTime = {timeSlot.startTime}
            endTime = {timeSlot.endTime}
            location = {timeSlot.location}
            sun = {timeSlot.days[0]}
            mon = {timeSlot.days[1]}
            tue = {timeSlot.days[2]}
            wed = {timeSlot.days[3]}
            thu = {timeSlot.days[4]}
            fri = {timeSlot.days[5]}
            sat = {timeSlot.days[6]}
            weeklyColor = {timeSlot.color}
        />);  

        return <div id = "editors" className = "editors">{editors}</div>

    }
}

export default Settings; 