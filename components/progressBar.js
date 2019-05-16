import CircularProgressbar from 'react-circular-progressbar';
import {Container} from 'semantic-ui-react';
import React, { Component } from 'react';


class progressBar extends React.Component {

    
    constructor(props) {
        super(props);
        this.state = { progress: 0 };
    }

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 4000);
    }

    clea

    componentDidUnMount() {
        clearInterval(this.interval);
    }



    tick(){

      
        this.setState(prevState => ({
          progress: prevState.progress + 2
        }));
        if(this.state.progress > 100){
            this.componentDidUnMount();
        }
    }


    render () {
        return (

        <div style={{ width: '100px' }}>

        {this.state.progress!=105 &&
            
            <CircularProgressbar percentage={this.state.progress} text={`${this.state.progress}%`}
            styles={{
                // Customize the root svg element
                root: {},
                // Customize the path, i.e. the "completed progress"
                path: {
                  // Path color
                  stroke: `rgba(62, 152, 199, ${this.state.progress / 100})`,
                  // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                  strokeLinecap: 'butt',
                  // Customize transition animation
                  transition: 'stroke-dashoffset 0.5s ease 0s',
                },
                // Customize the circle behind the path, i.e. the "total progress"
                trail: {
                  // Trail color
                  stroke: '#d6d6d6',
                },
                // Customize the text
                text: {
                  // Text color
                  fill: '#f88',
                  // Text size
                  fontSize: '16px',
                },
                // Customize background - only used when the `background` prop is true
                background: {
                  fill: '#3e98c7',
                },
              }}
              />
            }
        </div>
    
        )
    }
}
export default progressBar;
