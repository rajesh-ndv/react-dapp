import React, { Component } from "react";
import Card from 'react-bootstrap/Card';
import CanvasJSReact from './canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


class Analytics extends Component{

    render() {
          const accountsVsComments = {
            theme: 'light2', 
            animationEnabled: true, 
            animationDuration: 1200, 
            title: {
              text: 'Accounts Vs Likes',
            },
            data: [
              {
                type: 'column',
                dataPoints: this.props.axes,
              },
            ],
          }, 
          containerProps = {
            width: '100%',
            height: '300px',
            border: '1px solid black',
            padding: '25px 25px 25px 25px'
          };
    
        return (
          <div style={{ display: 'flex' }}>
            <Card style={{ width: '100rem' }}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
            <CanvasJSChart
                options={accountsVsComments}
            
                containerProps={containerProps}
            />
            </Card.Body>
            </Card>
          </div>
        );
      }

}

export default Analytics;