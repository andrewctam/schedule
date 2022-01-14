import React from 'react';

class ClassEditor extends React.Component {
    render() {
        return (
            <div className="classEditor">
                <div className="row">
                    <div className="col-sm-6 name">
                        <input id = {this.props.id + ":0"} type = "text" onChange = {this.handleChange} value = {this.props.name} placeholder="Name"/>
                    </div>

                    <div className="col-sm-6 link">
                        <input id = {this.props.id + ":3"} type="text" onChange = {this.handleChange} value = {this.props.info} placeholder="Class Location or Link with http(s)://"/>
                    </div>
                </div>


                <div className="row">
                    <div className="col-sm-6 times">
                        <input id = {this.props.id + ":1"} type = "time" onChange = {this.handleChange} required value = {this.props.startTime} />
                        <input id = {this.props.id + ":2"} type = "time" onChange = {this.handleChange} value = {this.props.endTime}/>
                    </div>

                    <div className="col-sm-6 checks">
                        <DateCheckBox htmlID ={this.props.id +  ":4"} dateBool = {this.props.sun} date = "Sun" handleChecked = {this.handleChecked}/>
                        <DateCheckBox htmlID ={this.props.id +  ":5"} dateBool = {this.props.mon} date = "Mon" handleChecked = {this.handleChecked}/>
                        <DateCheckBox htmlID ={this.props.id +  ":6"} dateBool = {this.props.tue} date = "Tue" handleChecked = {this.handleChecked}/>
                        <DateCheckBox htmlID ={this.props.id +  ":7"} dateBool = {this.props.wed} date = "Wed" handleChecked = {this.handleChecked}/>
                        <DateCheckBox htmlID ={this.props.id +  ":8"} dateBool = {this.props.thu} date = "Thu" handleChecked = {this.handleChecked}/>
                        <DateCheckBox htmlID ={this.props.id +  ":9"} dateBool = {this.props.fri} date = "Fri" handleChecked = {this.handleChecked}/>
                        <DateCheckBox htmlID ={this.props.id + ":10"} dateBool = {this.props.sat} date = "Sat" handleChecked = {this.handleChecked}/>
                    </div>
                </div>
                <button className = "btn btn-danger btn-sm delete" onClick = {this.handleDelete}>Delete From Schedule</button>
            </div>
        );
    }

    handleChange = (e) => {
        const element = e.target;
        if (!(element.value.includes(">") || element.value.includes("<")))
            this.props.updateClass(this.props.id, 
                parseInt(element.id.substring(element.id.indexOf(":") + 1)), 
                element.value);
    }

    handleChecked = (e) => {
        const element = e.target;
        this.props.updateClass(this.props.id, 
            parseInt(element.id.substring(element.id.indexOf(":") + 1)), 
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

export default ClassEditor;
