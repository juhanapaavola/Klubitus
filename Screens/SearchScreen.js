'use strict';

import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Linking,
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

class SearchScreen extends React.Component {	
  	constructor(props) {
    	super(props);    

    	this.state = {
       query: "",
       includeCity: true,
       includeDj: false,
       includeName: false,
       includeVenue: false,
       includeUpcoming: false
    	};

      this.getSearchResults = this.getSearchResults.bind(this);
  	}

	static navigationOptions = {
    	tabBarLabel: 'Search',
    // Note: By default the icon is only shown on iOS. Search the showIcon option below.
    	
	};

	_pressRow = (link) => {
    this.props.navigation.navigate('Result',{query: link});
  }

	

  getSearchResults = (link) => {
    return fetch(link)
        .then((res) => {
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

          if(item.hasOwnProperty('flyer_thumb') && item.flyer_thumb != null){
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
          isLoading:false,          
        });

        if(items.length > 0){
          this.setState({
            hasResults: true,
          });
        }
        else{
          this.setState({
            hasResults: false,
          });
        }

      })
      .catch((error) => {
        this.setState({
          isLoading:false,
          hasResults:false,
        });
      });
  }

	componentWillMount() {		
    	
  	}  	

  	render() {
      const ColoredRaisedButton = MKButton.coloredButton()
        .withText('Search')
        .withOnPress(() => {
          if(this.state.query.length < 3){
            Alert.alert(
              'Error',
              'Atleast 3 character need for search',
              [
                {text:'OK', onPress: () => console.log('OK Pressed') },
              ],
              {cancelable: false}
            );
          }          
          

          var querystr = "http://api.klubitus.org/v1/events/search?";
          if(this.state.includeCity){
            querystr += "search=city&";
          }
          if(this.state.includeDj){
            querystr += "search=dj&";
          }
          if(this.state.includeName){
            querystr += "search=name&";
          }
          if(this.state.includeVenue){
            querystr += "search=venue&";
          }
          if(this.state.includeUpcoming){
            querystr += "filter=date:upcoming&";
          }
          querystr += "q=" + this.state.query;          

          console.log("search: "+querystr);          
          this.props.navigation.navigate('Result',{query: querystr});
        })
        .build();

      const QueryField = MKTextField.textfieldWithFloatingLabel()
        .withPlaceholder('Search')
        .withStyle(styles.textfieldWithFloatingLabel)
        .withTextInputStyle({flex: 1})
        .withFloatingLabelFont({
          fontSize: 10,
          fontStyle: 'italic',
          fontWeight: '200',
        })  
        .withOnTextChange((e) => { this.state.query = e})
        .build();

    	return (

        <View>
          <ScrollView>
            
          <QueryField/>

          <View>
            <Text style={styles.label}>Search from</Text>
          </View>

          <View style={styles.searchrow}>
            <View style={styles.searchcontainer}>
              <Text style={styles.label}>City</Text>
            </View>
            <MKSwitch checked={this.state.includeCity}
                      style={styles.switch}                      
                      onCheckedChange={(e) => {
                        this.state.includeCity = e;
                      }}
            />
          </View>
          
          <View style={styles.searchrow}>
            <View style={styles.searchcontainer}>
              <Text style={styles.label}>Dj</Text>
            </View>
            <MKSwitch checked={this.state.includeDj}
                      style={styles.switch}                      
                      onCheckedChange={(e) => {
                        this.state.includeDj = e;
                      }}
            />
          </View>
            
          <View style={styles.searchrow}>
            <View style={styles.searchcontainer}>
              <Text style={styles.label}>Name</Text>
            </View>
            <MKSwitch checked={this.state.includeName}
                      style={styles.switch}                      
                      onCheckedChange={(e) => {
                        this.state.includeName = e;
                      }}
            />
          </View>

          <View style={styles.searchrow}>
            <View style={styles.searchcontainer}>
              <Text style={styles.label}>Venue</Text>
            </View>
            <MKSwitch checked={this.state.includeVenue}
                      style={styles.switch}                      
                      onCheckedChange={(e) => {
                        this.state.includeVenue = e;
                      }}
            />
          </View>
          
          <View style={styles.searchrow}>
            <View style={styles.searchcontainer}>
              <Text style={styles.label}>Upcoming events</Text>
            </View>
            <MKSwitch checked={this.state.includeUpcoming}
                      style={styles.switch}                      
                      onCheckedChange={(e) => {
                        this.state.includeUpcoming = e;
                      }}
            />
          </View>

          

          <ColoredRaisedButton />  
        </ScrollView>
        </View>
		);
	}
}


module.exports = SearchScreen;
