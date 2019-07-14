import React, {Component} from 'react';
import UserBase from '../Ethereum/Users';
import {Card, Button, List, Container, Header, Grid, GridRow, GridColumn, Breadcrumb} from 'semantic-ui-react';
import web3 from '../Ethereum/web3';

class Users extends Component {

    

    state = {
        username:'',
        items:[],
        balance:0
    };

    async componentDidMount(){

        const accounts = await web3.eth.getAccounts();

        const isUser = await UserBase.methods.userExists(accounts[0]).call();

        this.setState({username:'Loading'});

        if(!isUser){
            await UserBase.methods.createUser().send({
                from:accounts[0]
            });
        }

        const downloadSize = await UserBase.methods.getDownloadSize(accounts[0]).call();

        const results = await Promise.all(
            Array(parseInt(downloadSize)).fill().map((element, index) => {
                return UserBase.methods.getUserDownloadInfo(index, accounts[0]).call();
            })
        );

        this.setState({username:''});

        const pStyle = {
            fontSize: '15px',
            color:'blue',
            fontStyle:'italic'
          };


        const items = results.map((element,index) => 

            <Card>
                <Card.Content>

                <Card.Meta>Torrent File Information</Card.Meta>
                <Card.Description>

                <List divided relaxed>

                    <List.Item>
                        <List.Icon name='caret right' size='small' verticalAlign='middle' />
                        <List.Content>
                            <List.Header> FileName: <span style={pStyle}>{element[1]}</span></List.Header>
                        </List.Content>
                    </List.Item>

                    <List.Item>
                        <List.Icon name='caret right' size='small' verticalAlign='middle' />
                        <List.Content>
                            <List.Header>Link of File: <span style={pStyle}>{element[0]}</span></List.Header>
                        </List.Content>
                    </List.Item>

                    <List.Item>
                        <List.Icon name='caret right' size='small' verticalAlign='middle' />
                        <List.Content>
                            <List.Header>Size of File: <span style={pStyle}>{element[2]} KB</span></List.Header>
                        </List.Content>
                    </List.Item>

                    <List.Item>
                        <List.Icon name='caret right' size='small' verticalAlign='middle' />
                        <List.Content>
                            <List.Header>User Ratings: <span style={pStyle}>{element[4]} (0-5)</span></List.Header>
                        </List.Content>
                    </List.Item>

                    <List.Item>
                        <List.Icon name='caret right' size='small' verticalAlign='middle' />
                        <List.Content>
                            <List.Header>Cost of Downloading: <span style={pStyle}>{element[3]} Wei</span></List.Header>
                        </List.Content>
                    </List.Item>

                
                </List>
                
                </Card.Description>
                </Card.Content>
            </Card>
    
        );

       this.setState({items: items});
       this.setState({username: accounts[0]});
    }

    render() {

        return(
            <Container style= {{marginTop: '30px'}}>

                <Header size='small'>User Address:   {this.state.username}</Header>
                <br></br>
                <Grid>
                   


                    <GridRow columns={2}>
                        <GridColumn>
                            Downloads
                            <Card.Group>{this.state.items}</Card.Group> 
                        </GridColumn>
                        <GridColumn>
                            Uploads
                            <Card.Group>{this.state.items}</Card.Group> 
                        </GridColumn>
                    </GridRow>
                </Grid>
            </Container>
             
            
        );
    }
}

export default Users;
