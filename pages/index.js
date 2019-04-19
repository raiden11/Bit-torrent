import React, { Component } from 'react';
import Layout from '../components/layout'
import App from '../components/App';
import Users from '../components/users';
import {Grid, GridColumn, GridRow} from 'semantic-ui-react';
class Index extends Component {

  render() {
    return (

      <Layout>

        <Grid divided='vertically'>
            <Grid.Row columns={2}>
              <Grid.Column>
                <App></App>
              </Grid.Column>
              <Grid.Column>
                <Users></Users>
              </Grid.Column>
            </Grid.Row>
        </Grid>
  
      </Layout>

    );
  }
}

export default Index;
