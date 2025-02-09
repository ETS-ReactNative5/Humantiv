import React, {Component} from 'react';
import {
    Text,
    StyleSheet,
    Image
} from 'react-native';
import {Fonts} from '../../resources/fonts/Fonts'
import {primaryBlueColor} from '../themes/theme';
import Images from '../../resources/images';

const Icon = ({name, size, color, image=""}) => {
    const {textStyle,imageStyle} = styles;

    var code ="q";

    switch (name) {
        case "head":
            code = "w";
            break;
        case "trophee":
            code = "x";
            break;
        case "graph":
            code = "y";
            break;
        case "blocks":
            code = "z";
            break;
        case "thumbs_up_grey":
            code = "A";
            break;
        case "thumbs_up_green":
            code = "B";
            break;
        case "thumbs_down_grey":
            code = "C";
            break;        
        case "thumbs_down_red":
            code = "D";
            break; 
        case "heart_enabled":
            code = "E";
            break; 
        case "hands_heart":
            code = "F";
            break; 
        case "heart_disabled":
            code = "G";
            break; 
        case "market_enabled":
            code = "H";
            break; 
        case "market_disabled":
            code = "a";
            break; 
        case "runner":
            code = "b";
            break; 
        case "settings_enabled":
            code = "c";
            break; 
        case "settings_disabled":
            code = "d";
            break; 
        case "swimmer":
            code = "e";
            break; 
        case "vote_enabled":
            code = "f";
            break; 
        case "vote_disabled":
            code = "g";
            break; 
        case "wallet_enabled":
            code = "h";
            break; 
        case "wallet_disabled":
            code = "i";
            break; 
        case "plus_grey":
            code = "j";
            break;        
        case "plus_blue":
            code = "k";
            break;   
        case "bell":
            code = "l";
            break;               
        case "pencil":
            code = "m";
            break;               
        case "bench":
            code = "n";
            break;               
        case "heart_rate":
            code = "o";
            break;               
        case "medex":
            code = "p";
            break;               
        case "medit_small":
            code = "q";
            break;               
        case "medit":
            code = "s";
            break;               
        case "sandwich":
            code = "t";
            break;               
        case "search":
            code = "u";
            break;               
        case "sleep":
            code = "v";
            break;
        case "weight":
            code = "v";
            break;                                                  
        default:
            code = "image"
            break;
    }

    return (
        (code !== "image") ? 
        <Text style={
            [textStyle,
            {fontSize: ({size}) ? size : 16, color: color}]}>
            {code}
        </Text>
        :
        <Image
          style={imageStyle}
          width= {size}
          height= {size}
          source={Images[image]}
        />
    );
}

const styles = StyleSheet.create({
    textStyle: {
      textAlign: 'center',
      fontWeight: "200",
      fontFamily: Fonts.icons
    },
    imageStyle: {
      //color: primaryBlueColor,
    },
});

export {Icon}