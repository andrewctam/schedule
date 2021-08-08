import React from 'react';

class TimeSlot extends React.Component {
    render() {
        return (
            <div className = {this.props.when}>

                <div className = "row">
                    <div className = "col-sm-6" >
                        <h1 className = "text-center text-truncate">{this.props.name}</h1> 
                        <p className = "text-center text-nowrap">{this.to24H(this.props.startTime)} to {this.to24H(this.props.endTime)}</p>
                    </div>
                    <div className = "col-sm-6">
                        <button onClick={this.handleClick} className = "btn btn-info">{this.props.info}</button>
                    </div>
                </div>
            </div>
        );
    }

    to24H = (str) => {
        var hrs = parseInt(str.substring(0, 2));
        var mins = str.substring(3, 5);
        if (isNaN(hrs) || isNaN(mins)) {
            return "--:--";
        }
        var meridian = hrs < 12 ? "AM" : "PM";
        
        if (hrs > 12)
            hrs %= 12;

        return hrs + ":" + mins + " " + meridian;
    }

    handleClick = (e) => {
        if (this.props.info.includes(".") && (this.props.info.includes("http://") || this.props.info.includes("https://"))) {
            try {
                window.open(new URL(this.props.info), '_blank').focus();
            } catch (_) {
                console.log(this.props.info + " is an Invalid URL");
            }

        }
    }

}

    

export default TimeSlot;

