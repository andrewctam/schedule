import React from 'react';

class Editor extends React.Component {
    render() {
        return (
            <div className="classEditor">
                <div className="row">
                    <div className="col-sm-6 name">
                        <input id = {this.props.id + ":name"} type = "text" onChange = {this.handleChange} value = {this.props.name} placeholder="Name"/>
                    </div>

                    <div className="col-sm-6 link">
                        <input id = {this.props.id + ":location"} type="text" onChange = {this.handleChange} value = {this.props.location} placeholder="Class Location or Link with http(s)://"/>
                    </div>
                </div>


                <div className="row">
                    <div className="col-sm-6 times">
                        <input id = {this.props.id + ":startTime"} type = "time" onChange = {this.handleChange} required value = {this.props.startTime} />
                        <input id = {this.props.id + ":endTime"} type = "time" onChange = {this.handleChange} value = {this.props.endTime}/>
                    </div>

                    <div className="col-sm-6 checks">
                        <DateCheckBox htmlID ={this.props.id + ":su"} dateBool = {this.props.sun} date = "Sun" handleChecked = {this.handleChecked}/>
                        <DateCheckBox htmlID ={this.props.id + ":mo"} dateBool = {this.props.mon} date = "Mon" handleChecked = {this.handleChecked}/>
                        <DateCheckBox htmlID ={this.props.id + ":tu"} dateBool = {this.props.tue} date = "Tue" handleChecked = {this.handleChecked}/>
                        <DateCheckBox htmlID ={this.props.id + ":we"} dateBool = {this.props.wed} date = "Wed" handleChecked = {this.handleChecked}/>
                        <DateCheckBox htmlID ={this.props.id + ":th"} dateBool = {this.props.thu} date = "Thu" handleChecked = {this.handleChecked}/>
                        <DateCheckBox htmlID ={this.props.id + ":fr"} dateBool = {this.props.fri} date = "Fri" handleChecked = {this.handleChecked}/>
                        <DateCheckBox htmlID ={this.props.id + ":sa"} dateBool = {this.props.sat} date = "Sat" handleChecked = {this.handleChecked}/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-6 colorAdjust">
                         <input id ={this.props.id + ":color"} type = "color" className = "colorAdjuster" onChange = {this.handleChange} value = {this.props.weeklyColor} />
                    </div>
                        <div className="col-sm-6 delete">
                        <button className = "btn btn-danger btn-sm" onClick = {this.handleDelete}>Delete From Schedule</button>
                    </div>
                </div>
            </div>
        );
    }

    handleChange = (e) => {
        const element = e.target;
        if (!(element.value.includes(">") || element.value.includes("<")))
            this.props.updateClass(this.props.id, 
                element.id.substring(element.id.indexOf(":") + 1), 
                element.value);
    }

    handleChecked = (e) => {
        const element = e.target;
        this.props.updateClass(this.props.id, 
            element.id.substring(element.id.indexOf(":") + 1), 
            element.checked);
    } 
    
    handleDelete = (e) => {
        if (window.confirm("Are you sure you want to delete this from your schedule?"))
            this.props.removeClass(this.props.id);
    }

}

class DateCheckBox extends React.Component {
    render() {
        return <div className="form-check form-check-inline">
        <input id = {this.props.htmlID} className = "form-check-input" type = "checkbox" onChange={this.props.handleChecked} checked = {this.props.dateBool}/>
        <label htmlFor = {this.props.i} className = "form-check-label">{this.props.date}</label>
        </div>
    }
}

export default Editor;
