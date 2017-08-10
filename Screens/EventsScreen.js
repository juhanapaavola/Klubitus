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
  Image
} from 'react-native';
//import moment from 'moment';
import {
  getTheme
} from 'react-native-material-kit';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import styles from './kstyles'

const theme = getTheme();


var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var cancelableFetch = require('cancelable-fetch')
var request = null;

class EventsScreen extends React.Component {	
  	constructor(props) {
    	super(props);    

    	this.state = {
			isLoading: false,
			dataSource: ds.cloneWithRows([''])
    	};

    	this.doGetEvents = this.doGetEvents.bind(this);
    	theme.cardTitleStyle.color = "#fff";
    	theme.cardTitleStyle.backgroundColor = "#000";
    	this.getDate = this.getDate.bind(this);
  	}

	static navigationOptions = {
    	tabBarLabel: 'Events',
    // Note: By default the icon is only shown on iOS. Search the showIcon option below.
    	
	};

  	getEvents = () => {
  		this.state.isLoading = true;	
		this.doGetEvents();
  	}

  	doGetEvents = () => {
  		if(request){
      		request.cancel();
    	}
    	
    	request = cancelableFetch(fetch('http://api.klubitus.org/v1/events/browse?today')).then( (res) => {    
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

				this.setState({
					dataSource: ds.cloneWithRows(items),
					isLoading:false
				});


			})
			.catch((error) => {
				request = null;
				this.setState({
					isLoading:false
				});
			});
		return request;
  	}

	_pressRow = (data) => {
    	//Linking.openURL(link).catch(err => console.error('An error occurred', err));
    	this.props.navigation.navigate('Detail',{event: data});
  	}

  	getDate = (millis) =>{
    	console.log("getDate: "+parseInt(millis));
    	var d = new Date(parseInt(millis)*1000).toUTCString();
	    console.log("getDate: "+d);
    	return d;
  	}

	_renderRow = (rowData, sectionID, rowID, highlightRow) => {  	
		//console.log("rowdata: ",rowData);
		if(this.state.dataSource.getRowCount() > 1){			

			var sdate = this.getDate(rowData.stamp_begin);
			var edate = this.getDate(rowData.stamp_end);

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
								<Text style={theme.cardTitleStyle}>{rowData.name}</Text>
							</View>
							: 
							<View>
								<Text style={styles.noimageContainer}>{rowData.name}</Text>
							</View>
						}
						<Text style={theme.cardContentStyle}>Start {sdate}</Text>
              			<Text style={theme.cardContentStyle}>End {edate}</Text>													
						<Text style={theme.cardContentStyle}>
    						{rowData.shortInfo}
						</Text>
						
					</View>
				</TouchableHighlight>
    		);	
		}
		else {
			return null;
		}
    	
  	}

	_renderSeparator = (sectionID, rowID, adjacentRowHighlighted) => {
		return (
			<View
				key={`${sectionID}-${rowID}`}
				style={{
					height: 1,
					backgroundColor: '#CCCCCC',
					marginTop: 5
				}} 
			/>
		);
	}

	componentWillMount() {		
    	this.getEvents();
  	}  	

	componentWillUnmount(){
    	if(request){
    	  	request.cancel();
    	}
  	}

  	refreshFeed = () => {
		this.setState({
			isLoading:true,
    		dataSource: ds.cloneWithRows([''])
		});
    	this.render();
        this.getEvents();
  	}

  	render() {

    	return (

    		<View >
    			  
    			<ListView
    				style={styles.listView}
        			dataSource={this.state.dataSource}
        			renderRow={this._renderRow}
        			renderSeparator={this._renderSeparator}
        			refreshControl={
        				<RefreshControl
        					refreshing={this.state.isLoading}
        					onRefresh={this.refreshFeed.bind(this)}
        				/>
        			}
      			/>

    		</View>
		);
	}
}


module.exports = EventsScreen;
