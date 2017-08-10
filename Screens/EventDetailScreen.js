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
  Image,
  ScrollView
} from 'react-native';
//import moment from 'moment';
import {
  getTheme,
  MKButton
} from 'react-native-material-kit';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import styles from './kstyles'

const theme = getTheme();

class EventDetailScreen extends React.Component {	
  	constructor(props) {
    	super(props);    

    	this.state = {
        isLoading: false,
        event: null,
    	};

      this.getDate = this.getDate.bind(this);
  	}

	static navigationOptions = {
    	    
    	
	};

	componentWillMount() {		
    const { state } = this.props.navigation;
    var event = state.params.event;
    this.state.event = state.params.event;
  }  	

  getDate = (millis) =>{
    console.log("getDate: "+parseInt(millis));
    var d = new Date(parseInt(millis)*1000).toUTCString();
    console.log("getDate: "+d);
    return d;
  }

  	render() {

      var sdate = this.getDate(this.state.event.stamp_begin);
      var edate = this.getDate(this.state.event.stamp_end);

      const ColoredRaisedButton = MKButton.coloredButton()
        .withText('GO TO WEBSITE')
        .withOnPress(() => {
          Linking.openURL(this.state.event.url).catch(err => console.error('An error occurred', err));
        })
        .build();


    	return (

    		<View >
    			  
    			<ScrollView>
            <View style={theme.cardStyle}>  
          
              { this.state.event.fullThumb ?
                <View>
                <Image source={{uri : this.state.event.fullThumb}} style={theme.cardImageStyle} />
                <View>
                  { this.state.event.name ?
                    <Text style={theme.cardTitleStyle}>{this.state.event.name}</Text> : null
                  }
                </View>
                </View>
                : 
                <View>
                { this.state.event.name ?
                  <Text style={styles.noimageContainer}>{this.state.event.name}</Text> : null
                }
                </View>
              }

              
              
              <Text style={theme.cardContentStyle}>Start {sdate}</Text>
              <Text style={theme.cardContentStyle}>End {edate}</Text>

              {this.state.event.price ?
                <Text style={theme.cardContentStyle}>Price {this.state.event.price}</Text> : null
              }
              
              { this.state.event.city ?
                <Text style={theme.cardContentStyle}>Place {this.state.event.city}</Text> : null
              }

              { this.state.event.venue ?
                <Text style={theme.cardContentStyle}>Venue {this.state.event.venue}</Text> : null
              }

              <Text style={theme.cardContentStyle}>
                  {this.state.event.info}
              </Text>            

              { this.state.event.music ?
                <Text style={theme.cardContentStyle}>Music style: {this.state.event.music}</Text> : null
              }
            </View>

            <ColoredRaisedButton />
            <Text style={theme.cardContentStyle}> </Text>

          </ScrollView>
          
    		</View>
		);
	}
}


module.exports = EventDetailScreen;
