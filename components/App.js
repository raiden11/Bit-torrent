import React, { Component } from 'react';
import {Form,Input, FormField, Container, List, Card, Grid, GridRow, GridColumn, Button} from 'semantic-ui-react';
import ES from './ElasticClient' ;
import Layout from './layout';
import web3 from '../Ethereum/web3';
import UserBase from '../Ethereum/Users';
import Btorrent from '../Ethereum/Torrent';


const axios = require('axios');

import ProgressBar from './progressBar';


class App extends Component {

  state = {
    value: '',
    displayResults:'',
    description: [],
    downloadCost:0,
    progress:false
};


triggerSearch = async (event) => {
    event.preventDefault();
    this.setState({description: []});

    const value = event.target.value;
    const queryCount = 4;
    const maxSize = 5;
    const minLength = 3;
    this.setState({value: value});

    let data = await Promise.all(
      Array(parseInt(queryCount)).fill().map((element, index) => {
            return ES.search({
              index: 'movies_list',
              body:{
                    "suggest": {
                        "name-suggest" : {
                            "prefix" : value, 
                            "completion" : { 
                                "field" : "suggest" ,
                                "size": maxSize, 
                                "skip_duplicates": false,
                                "fuzzy":{
                                  "fuzziness":index,
                                  "min_length": minLength
                                }
                            }
                        }
                    }
                }
              }).then(data => {return data})
            .catch(err => console.log(err));
      })
  );

  
  let duplicates = new Set();
  let results = [];
  data.map((Element, Index) => {
    Element.suggest['name-suggest'][0].options.map((element, index) => {
      
        let val = element["_source"]["output"];
        if(!duplicates.has(val)){
          duplicates.add(val);
          results.push(val);
        }
        return index;
    });
    return Index;
  });

  let first = [];
  let second = [];
  results.map((element, index) => {
  
    if(element.toLowerCase()[0] === value.toLowerCase()[0])first.push(element);
    else second.push(element);
    return index;
  })

  second.map((element, index) => {
    first.push(element);
    return index;
  });



  first = first.slice(0,Math.min(10, first.length));
  const displayResults = first.map((element) => 
    <List.Item key = {element}>
      <List.Icon name='favorite' size='large' verticalAlign='middle' />
      <List.Content>
        <List.Header as='a' onClick={this.onClick}>{element}</List.Header>
      </List.Content>
    </List.Item>
  );

  

  this.setState({displayResults: displayResults})
}


  startDownload = async(event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.call();

    await UserBase.methods.startDownload(this.state.downloadCost).send({
      from: accounts[0],
      value: this.state.downloadCost
    });

    
  }

  call = async(event) => {

    const url = "http://localhost:5000/download";

    // add progess bar

    this.setState({progress:true});
    console.log(this.state.progress);
    
    axios.get(url).then(data => {
      console.log(data.data);
      setInterval(this.callUpload, 5000);
    });


  }

  callUpload = async(event) => {

    const url = "http://localhost:5000/upload";
    const data = await axios.get(url);
    console.log(data.data);

  }

  onClick = async(event) => {
    event.preventDefault();
    const searchTerm = "www.google.com";

    const response = await Btorrent.methods.getTorrentInfo(searchTerm).call();
    console.log(response);
    const results = [];
    results.push(response);

    const items = results.map((element,index) => 

            <Card>
                <Card.Content>

                <Card.Meta>Torrent Download Information</Card.Meta>
                <Card.Description>

                <List divided relaxed>

                    <List.Item>
                        <List.Icon name='caret right' size='small' verticalAlign='middle' />
                        <List.Content>
                            <List.Header> FileName: {element[1]}</List.Header>
                        </List.Content>
                    </List.Item>

                    <List.Item>
                        <List.Icon name='caret right' size='small' verticalAlign='middle' />
                        <List.Content>
                            <List.Header>Link of File: {element[0]}</List.Header>
                        </List.Content>
                    </List.Item>

                    <List.Item>
                        <List.Icon name='caret right' size='small' verticalAlign='middle' />
                        <List.Content>
                            <List.Header>Size of File: {element[2]} kB</List.Header>
                        </List.Content>
                    </List.Item>

                    <List.Item>
                        <List.Icon name='caret right' size='small' verticalAlign='middle' />
                        <List.Content>
                            <List.Header>User Ratings: {element[4]} (0-5)</List.Header>
                        </List.Content>
                    </List.Item>

                    <List.Item>
                        <List.Icon name='caret right' size='small' verticalAlign='middle' />
                        <List.Content>
                            <List.Header>Cost of Downloading: {element[3]*1000 } wei</List.Header>
                        </List.Content>
                    </List.Item>

                
                </List>
                
                </Card.Description>
                </Card.Content>
                <Card.Content extra>
                <div className='ui button'>
                    <Button color='red' onClick={this.startDownload}>
                    Start Download
                    </Button>
                </div>
                </Card.Content>
            </Card>


    );

    this.setState({downloadCost:results[0][3]});
    this.setState({displayResults: [], description: items});
  }


  render() {

    return (

        <Layout>

            <Container style= {{marginTop: '30px'}}>
      
                <Grid>

                <GridRow>
                    <GridColumn width={12}>
                        <Form onSubmit = {this.onSubmit}>
                            <FormField>
                                <label style={{fontSize:'16px'}}>Search for file name</label>
                                <Input
                                    value = {this.state.value}
                                    onChange = {this.triggerSearch}
                                />
                        
                            </FormField>
                            <List divided relaxed>{this.state.displayResults}</List>
                        </Form>
                    </GridColumn>
                </GridRow>

                <GridRow>
                    <GridColumn>
                        <Card.Group>{this.state.description}</Card.Group>
                    </GridColumn>
                </GridRow>

                
                <GridRow>

                  {this.state.progress && <ProgressBar/>}
                </GridRow>
                </Grid>
                    
            </Container>
      </Layout>

    );
  }
}

export default App;
