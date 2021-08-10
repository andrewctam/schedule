import React from 'react';

class TimeSlotEditor extends React.Component {
    render() {
        return (
            <div className = "tsEditor">
                <div className = "row">
                    <div className="col-sm-6 name">
                        <input id = "0" type = "text" onChange = {this.handleChange} value = {this.props.name} placeholder="Name"/>
                    </div>
                    <div className="col-sm-6 link">
                        <input id = "3" type="text" onChange = {this.handleChange} value = {this.props.info} placeholder="Class Location or Link with http(s)://"/>
                    </div>
                </div>

                <div className = "row">
                    <div className = "col-sm-6 times">
                            <input id = "1" type = "time" onChange = {this.handleChange} required value = {this.props.startTime} />
                        
                            <input id = "2" type = "time" onChange = {this.handleChange} value = {this.props.endTime}/>
                        </div>
                        <div className="col-sm-6">
                            <div className = "checks">
                                <div className="form-check form-check-inline">
                                    <input id = "4" className = "form-check-input" type = "checkbox" onChange={this.handleChecked} checked = {this.props.sun}/>
                                    <label htmlFor = "4" className = "form-check-label">Sun</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input id = "5" className = "form-check-input" type = "checkbox" onChange={this.handleChecked} checked = {this.props.mon}/>
                                    <label htmlFor = "5" className = "form-check-label">Mon</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input id = "6" className = "form-check-input" type = "checkbox" onChange={this.handleChecked} checked = {this.props.tue}/>
                                    <label htmlFor = "6" className = "form-check-label">Tue</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input id = "7" className = "form-check-input" type = "checkbox" onChange={this.handleChecked} checked = {this.props.wed}/>
                                    <label htmlFor = "7" className = "form-check-label">Wed</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input id = "8" className = "form-check-input" type = "checkbox" onChange={this.handleChecked} checked = {this.props.thu}/>
                                    <label htmlFor = "8" className = "form-check-label">Thu</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input id = "9" className = "form-check-input" type = "checkbox" onChange={this.handleChecked} checked = {this.props.fri}/>
                                    <label htmlFor = "9" className = "form-check-label">Fri</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input id = "10" className = "form-check-input" type = "checkbox" onChange={this.handleChecked} checked = {this.props.sat}/>
                                    <label htmlFor = "10" className = "form-check-label">Sat</label>
                                </div>
                            </div>
                        </div>
                </div>
                <button className = "btn btn-danger btn-sm delete" onClick = {this.handleDelete}>Delete From Schedule</button>
            </div>
        );
    }

    handleChange = (e) => {
        const element = e.target;
        if (!(element.value.includes(">") || element.value.includes("<")))
            this.props.updateSchedule(this.props.id, parseInt(element.id), element.value);
    }

    handleChecked = (e) => {
        const element = e.target;
        this.props.updateSchedule(this.props.id, parseInt(element.id), element.checked);
    } 
    
    handleDelete = (e) => {
        if (window.confirm("Are you sure you want to delete this from your schedule?"))
            this.props.removeFromSchedule(this.props.id);
    }
}

export default TimeSlotEditor;
