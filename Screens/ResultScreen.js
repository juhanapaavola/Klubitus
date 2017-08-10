'use strict';

import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicator,
  ListView,
  Linking,
  RefreshControl,
  ScrollView,
  Alert,
  Image
} from 'react-native';
//import moment from 'moment';
import {
  getTheme,
  MKTextField,
  MKColor,
  MKButton,
  MKSwitch
} from 'react-native-material-kit';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import styles from './kstyles'

const theme = getTheme();

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var cancelableFetch = require('cancelable-fetch')
var request = null;

class SearchScreen extends React.Component {	
  	constructor(props) {
    	super(props);    

    	this.state = {
			  isLoading: false,
			  dataSource: ds.cloneWithRows(['']),
        query: "",       
    	};

      this.getSearchResults = this.getSearchResults.bind(this);
  	}

	static navigationOptions = {
    	tabBarLabel: 'Search',
    // Note: By default the icon is only shown on iOS. Search the showIcon option below.
    	
	};

  getSearchResults = (link) => {
    if(request){
      request.cancel();
    }
    request = cancelableFetch(fetch(link)).then( (res) => {    
      request = null
      return res.json();
    })
    
      .then((response) => {
        console.log("data: "+JSON.stringify(response.events));
        var items = [];
        var events = response.events;

        var tmp = events.map((item) => {    
          var ni = item;

          if(item.hasOwnProperty('info') && item.info != null){
            var info = JSON.stringify(item.info);
            console.log("info: "+info.length);
            if(info.length > 120){
              info = item.info.substring(0,120)+"... <more>"; 
            }
            else{
              info = item.info;
            }
            ni.shortInfo = info;
          }

          if(item.hasOwnProperty('flyer_thumb') && item.flyer_thumb != null && item.flyer_thumb.length > 1){
            var fullthumb = "http://klubitus.org"+item.flyer_thumb;
            ni.fullThumb = fullthumb;
          }
          else {
            ni.fullThumb = null;
          }
  
          items.push(ni);
        });       

        if(items.length < 1){
          var empty = new Object();
          empty.shortInfo = "No results";
          items.push(empty);
        }

        this.setState({
          dataSource: ds.cloneWithRows(items),
          isLoading:false,          
        });

        
        request = null;

      })
      .catch((error) => {
        request = null;
        this.setState({
          isLoading:false,
          hasResults:false,
        });
      });
    
      return request;
  }

	_pressRow = (data) => {
    this.props.navigation.navigate('Detail',{event: data});
  }

	_renderRow = (rowData, sectionID, rowID, highlightRow) => {  
  console.log("renderRow: "+rowData);	
    return (        
        <TouchableHighlight 
          underlayColor= '#fffffff5'
          onPress={() => {
            this._pressRow(rowData);
            highlightRow(sectionID, rowID); 
          }}>
          <View style={theme.cardStyle}>
          
            { rowData.fullThumb ?
              <View>
                <Image source={{uri : rowData.fullThumb}} style={theme.cardImageStyle} />
                <View>
                  { rowData.name ?
                    <Text style={theme.cardTitleStyle}>{rowData.name}</Text> : null
                  }
                </View>
                </View>
                : 
                <View>
                { rowData.name ?
                  <Text style={styles.noimageContainer}>{rowData.name}</Text> : null
                }
                </View>
              
            }
            
            <Text style={theme.cardContentStyle}>
                {rowData.shortInfo}
            </Text>

          </View>
        </TouchableHighlight>
        );
  }

	_renderSeparator = (sectionID, rowID, adjacentRowHighlighted) => {
		return (
			<View
				key={`${sectionID}-${rowID}`}
				style={{
					height: 1,
					backgroundColor: '#CCCCCC',
				}} 
			/>
		);
	}

	componentWillMount() {		
    const { state } = this.props.navigation;
    this.state.query = state.params.query;
    this.getSearchResults(this.state.query);
  }  	

  componentWillUnmount(){
    if(request){
      request.cancel();
    }
  }

  	render() {
    	return (

        <View>
          <ListView
                  style={styles.listView}
                  dataSource={this.state.dataSource}
                  renderRow={this._renderRow}
                  renderSeparator={this._renderSeparator}
                />
        </View>
		);
	}
}


module.exports = SearchScreen;
