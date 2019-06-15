import React, { Component } from 'react';
import {Navbar, Card, NavbarBrand, Spinner} from 'reactstrap';
import Highcharts from 'highcharts';
import URLs from './config/url';
import 'bootstrap/dist/css/bootstrap.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data : [],
      error : false,
      loader : true,
    }
  }

  componentDidMount = () => {
    this.getData();
  }

  convertData = (data) => {
    var temp = data["Time Series (5min)"]
    var arr = [];
    console.log('step 2',data);
    Object.keys(temp).forEach((el) => {
      let singleArr = [];
      singleArr.push(Math.round(new Date(el).getTime()/1000));
      singleArr.push(Number(temp[el]["1. open"]));
      singleArr.push(Number(temp[el]["2. high"]));	
      singleArr.push(Number(temp[el]["3. low"]));
      singleArr.push(Number(temp[el]["4. close"]));
      arr.push(singleArr);
    });
    console.log('step 3',arr);
    this.setState({
      data : arr
    });
    this.highchartRender();
  }

  getData = () => {
    fetch(URLs.API)
    .then((res) => {
      if (res.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
        res.status);
        this.setState({
          error : true
        });
        return;
      }

      const High = this.convertData;
      console.log(High);
        res.json().then(function(data) {
          console.log('step 1',data, High);
          High(data);
        });
    })
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
      this.setState({
        error : true
      });
    });
  }

  highchartRender = () => {
    Highcharts.chart('container', {
      title: {
          text: 'Stock Market scores'
      },

      chart: {
        styledMode: true
      },

      rangeSelector: {
        selected: 1
      },
  
      series: [{
        type: 'candlestick',
        name: 'Stock price',
        data: this.state.data
      }]
    });
  }


  render() {
    return (
      <div>
        <Navbar light expand="md" style={{'backgroundColor': '#9D9D9D'}}>
          <NavbarBrand href="/" className="mr-auto">Crypto</NavbarBrand>
        </Navbar>
        {this.state.loader ?  <div style={{'padding': '20px'}}>
          <center>loading data please wait <Spinner color="primary" /></center>
        </div>  : 
        
        <div style={{'padding': '20px'}}>
          <Card body>
            <div id="container"></div>
          </Card>
        </div>
        
        }
      </div>
    );
  }
}

export default App;
