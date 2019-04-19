import React from 'react';
import {Container} from 'semantic-ui-react';

export default (props) => {
    return (
        <Container>
            <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"/>
        <div>  
            {props.children}
        </div>
        </Container>
    )
}