import React from 'react';

class TimeSlot extends React.Component {

    render() {
        return (
            <div> 
                <button         
                id = {this.props.addPadding ? "timeslot" : null}
                onClick={this.handleClick} 
                className = {"btn btn-info " + this.props.when}>
                    
                    <h1 className = "text-center text-truncate">{this.props.name}</h1> 
                    <h6 className = "text-center text-truncate">{this.to24H(this.props.startTime)} to {this.to24H(this.props.endTime)}</h6> 
                    <p className = "text-center text-truncate">{this.props.info}</p>
                    
                </button>
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
        
        if (hrs > 12) {
            hrs %= 12;
        } else if (hrs === 0) {
            hrs = 12;
        }

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

    componentDidMount() {
        if (this.props.addPadding)
            document.body.style.paddingBottom = document.getElementById("timeslot").clientHeight + "px";
    }

    componentWillUnmount() {
        if (this.props.addPadding)
            document.body.style.paddingBottom = "0px";
    }


}

    

export default TimeSlot;

