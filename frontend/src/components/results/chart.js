import React, { Component } from 'react';
import CanvasJSReact from './canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
 
class LineChart extends Component {
	render() {
		const options = {
			animationEnabled: true,
			theme: "light2", // "light1", "dark1", "dark2"
			title:{
				text: "Trends"
			},
			axisY: {
				title: "Hits",
				includeZero: true,
			},
			axisX: {
				title: "Month of year",
				interval: 1
			},
			data: [{
				type: "line",
				toolTipContent: "Month {x}: {y} hits",
                dataPoints: [
                    { y:  this.props.datapoints[0], label: "January" },
                    { y:  this.props.datapoints[1], label: "February" },
                    { y:  this.props.datapoints[2], label: "March" },
                    { y:  this.props.datapoints[3], label: "April" },
                    { y:  this.props.datapoints[4], label: "May" },
                    { y:  this.props.datapoints[5], label: "June" },
                    { y:  this.props.datapoints[6], label: "July" },
                    { y:  this.props.datapoints[7], label: "August" },
                    { y:  this.props.datapoints[8], label: "September" },
                    { y:  this.props.datapoints[9], label: "October" },
                    { y:  this.props.datapoints[10], label: "November" },
                    { y:  this.props.datapoints[11], label: "December" },
                ]
            }],
            
		}
		
		return (
		<div>
			<CanvasJSChart options = {options} 
				/* onRef={ref => this.chart = ref} */
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
}

export default LineChart;                           
