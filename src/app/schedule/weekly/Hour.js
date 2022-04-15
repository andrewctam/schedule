import React from 'react';


class Hour extends React.Component {
    render() {
        var hrs = this.props.time;

        if (isNaN(hrs)) {
            var meridian = "";
        } else {
            meridian = hrs < 12 ? "AM" : "PM";
            if (hrs > 12) {
                hrs %= 12;
            } else if (hrs === 0) {
                hrs = 12;
            }
        }
        
        var daysOfWeek = []
        for ( var i = 0; i < this.props.numOfDays; i++) {
            daysOfWeek.push(<td key = {this.props.time + "," + i} />) 
        }

        return (
                <tr>
                    <th scope = "row" style = {{verticalAlign: "top"}}>
                        <p>{hrs + " " + meridian}</p>
                    </th>
                    {daysOfWeek}
                </tr>

        )
    }
}

export default Hour;