import React, { Component } from 'react';
import {Form,Input, FormField, Container, List, Card, Grid, GridRow, GridColumn, Button} from 'semantic-ui-react';
import ES from './ElasticClient' ;
import Layout from './layout';
import web3 from '../Ethereum/web3';
import UserBase from '../Ethereum/Users';
import Btorrent from '../Ethereum/Torrent';
let accounts;
const TorrentInfo = require('./torrentInfoArray');
const axios = require('axios');
const Download = require('./client_download');

import ProgressBar from './progressBar';
import { type } from 'os';


class App extends Component {

  state = {
    value: '',
    displayResults:'',
    description: [],
    downloadCost:0,
    progress:false,
    fileName:'',
    fileLink:'',
    fileSize:0,
    rating:0,
    userId:''
};


async componentDidMount(){
  accounts = await web3.eth.getAccounts();
}


triggerSearch = async (event) => {
    event.preventDefault();
    this.setState({description: []});

    const value = event.target.value;
    const queryCount = 4;
    const maxSize = 15;
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
                                "skip_duplicates": true,
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


  console.log(data);

  
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



  first = first.slice(0,Math.min(15, first.length));
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

    this.setState({progress:true});

    await UserBase.methods.startDownload(this.state.downloadCost, this.state.fileLink,
      this.state.fileName, this.state.fileSize, this.state.rating,
      '0x0FcF01fCF8AF6f97BE17a4e1Db701D2cfFD78645', this.state.userId).send({
      from: accounts[0],
      value: this.state.downloadCost
    });

    this.call();

    
  }

  call = async(event) => {

    let body = {
      fileName:this.state.fileName,
      fileSize:this.state.fileSize
    }

    const url = "http://localhost:5000/download";


    axios.post(url, body).then(data => {

      Download.download(data.data,this.state.fileName);
      setInterval(this.callUpload, 20000);
    });

  }

  callUpload = async(event) => {

    const url = "http://localhost:5000/upload";
    axios.post(url, body).then(data = async(event) => {

      if(data.uploadedData!=-1){
        await UserBase.methods.receiveReward(data.uploadedData, this.state.userId)
        .send({
            from: accounts[0],
        });
      }
    });

  }

  onClick = async(event) => {
    event.preventDefault();
    const searchTerm = event.target.textContent;

    const Randomindex = Math.floor(Math.random() * (5 - 0)) + 0;
    const results = [];
    results.push(TorrentInfo[Randomindex]);

    const pStyle = {
      fontSize: '15px',
      color:'blue',
      fontStyle:'italic'
    };

    const items = results.map((element,index) => 

            <Card key="1">
                <Card.Content>

                <Card.Meta>Torrent Download Information</Card.Meta>
                <Card.Description>

                <List divided relaxed>

                    <List.Item>
                        <List.Icon name='caret right' size='small' verticalAlign='middle' />
                        <List.Content>
                            <List.Header> FileName:  <span style={pStyle}>{searchTerm}</span></List.Header>
                        </List.Content>
                    </List.Item>

                    

                    <List.Item>
                        <List.Icon name='caret right' size='small' verticalAlign='middle' />
                        <List.Content>
                            <List.Header>Link of File: <span style={pStyle}>{element['link']}</span></List.Header>
                        </List.Content>
                    </List.Item>

                    <List.Item>
                        <List.Icon name='caret right' size='small' verticalAlign='middle' />
                        <List.Content>
                            <List.Header>Size of File: <span style={pStyle}>{element['size']} Kb</span></List.Header>
                        </List.Content>
                    </List.Item>

                    <List.Item>
                        <List.Icon name='caret right' size='small' verticalAlign='middle' />
                        <List.Content>
                            <List.Header>User Ratings: <span style={pStyle}>{element['rating']} (0-5)</span></List.Header>
                        </List.Content>
                    </List.Item>

                    <List.Item>
                        <List.Icon name='caret right' size='small' verticalAlign='middle' />
                        <List.Content>
                            <List.Header>Cost of Downloading: <span style={pStyle}>{Math.floor((element['size']*5)/3) } wei</span></List.Header>
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

    this.setState({downloadCost:Math.floor((TorrentInfo[Randomindex]['size']*5)/3)});
    this.setState({fileName: searchTerm, fileLink:TorrentInfo[Randomindex]['link'],
       fileSize:TorrentInfo[Randomindex]['size'], rating:TorrentInfo[Randomindex]['rating'], userId:accounts[0]});

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
