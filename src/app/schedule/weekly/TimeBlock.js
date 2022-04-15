import React from "react";

class TimeBlock extends React.Component {
    render() {
        return <div id={this.props.i} className = "block" onClick = {this.handleClick} style = {
            {
                height: this.props.height + "px",
                top: this.props.classStart.getHours() * 60 + this.props.classStart.getMinutes() - (this.props.scheduleStart - 1) * 60 + "px",
                left: (100 / (this.props.days.length + 1)) * (this.props.j + 1) + "%",
                backgroundColor: this.props.schedule[this.props.i].color,
                color: this.darkOrWhiteText(this.props.schedule[this.props.i].color),
            }}>
                
            <p className = "text-center text-truncate text-wrap">{this.props.schedule[this.props.i].name}</p>
            <p className = "text-center text-truncate text-wrap">{this.props.schedule[this.props.i].location}</p>
        </div>
    }

    darkOrWhiteText(bkColor) { //#123456
        var brightness = Math.round((
                    (Number("0x" + bkColor.substring(1, 3)) * 299) +
                    (Number("0x" + bkColor.substring(3, 5)) * 587) +
                    (Number("0x" + bkColor.substring(5)) * 114)) / 1000);
        return (brightness > 125) ? 'black' : 'white';

    }


    handleClick = () => {
       this.props.showTimeSlot(this.props.i);
    }


}

export default TimeBlock;