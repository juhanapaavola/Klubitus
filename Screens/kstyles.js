'use strict';

import React, {StyleSheet} from 'react-native'

export default StyleSheet.create({

	container: {
	    padding: 20,
    	marginTop: 0,
    	alignItems: 'center'
  	},
	row: {
		paddingTop: 5
	},
	
	listView:{

	},
	noimageContainer: {
		padding: 20,
		backgroundColor: "#000",
		fontSize: 20,
		color: "#fff",
	},

	button:{
		marginTop:5,
		marginBottom:5
	},

	textfieldWithFloatingLabel: {
		height: 48,  // have to do it on iOS
		marginTop: 10,
	},
	appleSwitch: {
		marginTop: 7,
		marginBottom: 7,
	},
	switch: {
		marginTop: 2,    
	},
	label: {
		textAlign: 'left',
		color: '#666666',
		marginTop: 2,
	},
	indicator:{
		marginTop: 10,
	},
	searchrow: {
		flex: 1,
		flexDirection: 'row',
    // alignItems: 'center', // this will prevent TFs from stretching horizontal
		marginLeft: 7, marginRight: 7,
    // backgroundColor: MKColor.Lime,    
	},
	searchcontainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'flex-start'
	},
});