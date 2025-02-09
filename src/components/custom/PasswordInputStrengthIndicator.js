//
// This Component is built using Dropbox zxcvbn password strength estimator library -
// https://github.com/dropbox/zxcvbn
// Inspired by https://github.com/ttdung11t2/react-native-password-strength-checker.
//

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { 
    View, 
    StyleSheet, 
    Dimensions, 
    Text, 
    Animated,
    TextInput,
    ViewPropTypes
   } from 'react-native';
import {IconPasswordInput} from '../custom';
import zxcvbn from 'zxcvbn';
import _ from 'lodash';
import FontAwesome, { Icons } from 'react-native-fontawesome';


const { width: wWidth } = Dimensions.get('window');

const widthByPercent = (percentage, containerWidth = wWidth) => {
  const value = (percentage * containerWidth) / 100 - 20;
  return Math.round(value);
};

const regex = {
  digitsPattern: /\d/,
  lettersPattern: /[a-zA-Z]/,
  lowerCasePattern: /[a-z]/,
  upperCasePattern: /[A-Z]/,
  wordsPattern: /\w/,
  symbolsPattern: /\W/
};

class PasswordInputStrengthIndicator extends Component {
  static defaultProps = {
    minLevel: 2,
    minLength: 8,
    ruleNames: 'lowerCase|upperCase|digits|symbols',
    strengthLevels: [
      {
        label: 'Weak',
        labelColor: '#fe6c6c',
        widthPercent: 25,
        innerBarColor: '#fe6c6c'
      },
      {
        label: 'Weak',
        labelColor: '#fe6c6c',
        widthPercent: 25,
        innerBarColor: '#fe6c6c'
      },
      {
        label: 'Fair',
        labelColor: '#feb466',
        widthPercent: 50,
        innerBarColor: '#feb466'
      },
      {
        label: 'Good',
        labelColor: '#81fe2c',
        widthPercent: 75,
        innerBarColor: '#81fe2c'
      },
      {
        label: 'Strong',
        labelColor: '#6cfeb5',
        widthPercent: 100,
        innerBarColor: '#6cfeb5'
      }
    ],
    tooShort: {
      enabled: true,
      labelColor: '#fe6c6c',
      label: 'Too short',
      widthPercent: 33,
      innerBarColor: '#fe6c6c'
    },
    barColor: '#ffffff',
    barWidthPercent: 70,
    showBarOnEmpty: true
  };
  
  static propTypes = {
    onChangeText: PropTypes.func.isRequired,
    minLength: PropTypes.number,
    ruleNames: PropTypes.string,
    strengthLevels: PropTypes.array,
    tooShort: PropTypes.object,
    minLevel: PropTypes.number,
    inputWrapperStyle: ViewPropTypes.style,
    inputStyle: TextInput.propTypes.style,
    strengthWrapperStyle: ViewPropTypes.style,
    strengthBarStyle: ViewPropTypes.style,
    innerStrengthBarStyle: ViewPropTypes.style,
    strengthDescriptionStyle: Text.propTypes.style,
    barColor: PropTypes.string,
    barWidthPercent: PropTypes.number,
    showBarOnEmpty: PropTypes.bool
  };
  
  constructor(props) {
    super(props);
    this.animatedInnerBarWidth = new Animated.Value(0);
    this.animatedBarWidth = new Animated.Value(0);
    this.state = {
      level: -1,
      isTooShort: false
    }
  }
  
  componentDidMount() {
    const { showBarOnEmpty } = this.props;
    if (showBarOnEmpty) {
      this.showFullBar();
    }
  }
  
  showFullBar(isShow = true) {
    const { barWidthPercent } = this.props;
    const barWidth = isShow ? widthByPercent(barWidthPercent) : 0;
    Animated.timing(this.animatedBarWidth, {
      toValue: barWidth,
      duration: 20
    }).start();
  }
  
  isTooShort(password) {
    const { minLength } = this.props;
    if (!minLength) {
      return true;
    }
    return password.length < minLength;
  }
  
  isMatchingRules(password) {
    const { ruleNames } = this.props;
    if (!ruleNames) {
      return true;
    }
    
    const rules = _.chain(ruleNames)
      .split('|')
      .filter(rule => !!rule)
      .map(rule => rule.trim())
      .value();
    
    for (const rule of rules) {
      if (!this.isMatchingRule(password, rule)) {
        return false;
      }
    }
    return true;
  }
  
  isMatchingRule(password, rule) {
    switch (rule) {
      case 'symbols':
        return regex.symbolsPattern.test(password);
      case 'words':
        return regex.wordsPattern.test(password);
      case 'digits':
        return regex.digitsPattern.test(password);
      case 'letters':
        return regex.lettersPattern.test(password);
      case 'lowerCase':
        return regex.lowerCasePattern.test(password);
      case 'upperCase':
        return regex.upperCasePattern.test(password);
      default:
        return true;
    }
  }
  
  calculateScore(text) {
    if (!text) {
      this.setState({
        isTooShort: false
      });
      return -1;
    }
    
    if (this.isTooShort(text)) {
      this.setState({
        isTooShort: true
      });
      return 0;
    }
    
    this.setState({
      isTooShort: false
    });
    
    if (!this.isMatchingRules(text)) {
      return 0;
    }
    
    return zxcvbn(text).score;
  }
  
  getPasswordStrengthLevel(password) {
    return this.calculateScore(password);
  }
  
  onChangeText(password) {
    const level = this.getPasswordStrengthLevel(password);
    this.setState({
      level: level
    });
    const isValid = this.isMatchingRules(password) && level >= this.props.minLevel;
    this.props.onChangeText(password, isValid);
  }
  
  renderPasswordInput() {
    const { inputWrapperStyle, inputStyle } = this.props;
    return (
      <View style={[styles.inputWrapper, inputWrapperStyle]}>
        <IconPasswordInput
          icon={this.props.icon}
          placeholder={this.props.placeholder}
          value={this.props.value}
          enablesReturnKeyAutomatically
          returnKeyType={ "done" }
          autoCapitalize="none"
          autoCorrect={false}
          multiline={false}
          {...this.props}
          onChangeText={text => this.onChangeText(text)}
        />
      </View>
    );
  }
  
  renderPasswordStrength() {
    const {
      barWidthPercent,
      tooShort,
      strengthLevels,
      barColor,
      strengthWrapperStyle,
      strengthBarStyle,
      innerStrengthBarStyle,
      strengthDescriptionStyle,
      showBarOnEmpty
    } = this.props;
    
    const barWidth = widthByPercent(barWidthPercent);
    
    const { level } = this.state;
    
    let strengthLevelBarStyle = {}, strengthLevelLabelStyle = {}, strengthLevelLabel = '', innerBarWidth = 0;
    if (level !== -1) {
      
      if (!showBarOnEmpty) {
        this.showFullBar();
      }
      
      innerBarWidth = widthByPercent(strengthLevels[level].widthPercent, barWidth);
      strengthLevelBarStyle = {
        backgroundColor: strengthLevels[level].innerBarColor
      };
      
      strengthLevelLabelStyle = {
        color: strengthLevels[level].labelColor
      };
      strengthLevelLabel = strengthLevels[level].label;
      
      if (tooShort.enabled && this.state.isTooShort) {
        innerBarWidth = widthByPercent(tooShort.widthPercent, barWidth) || widthByPercent(strengthLevels[level].widthPercent, barWidth);
        strengthLevelBarStyle = {
          backgroundColor: tooShort.innerBarColor || strengthLevels[level].innerBarColor
        };
        strengthLevelLabelStyle = {
          color: tooShort.labelColor || strengthLevels[level].labelColor
        };
        strengthLevelLabel = tooShort.label || strengthLevels[level].label;
      }
    } else {
      if (!showBarOnEmpty) {
        this.showFullBar(false);
      }
    }
    
    Animated.timing(this.animatedInnerBarWidth, {
      toValue: innerBarWidth,
      duration: 800
    }).start();
    
    return (
      <View style={[styles.passwordStrengthWrapper, strengthWrapperStyle]}>
        <Animated.View style={[styles.passwordStrengthBar, strengthBarStyle, { backgroundColor: barColor, width: this.animatedBarWidth }]}>
          <Animated.View style={[styles.innerPasswordStrengthBar, innerStrengthBarStyle, { ...strengthLevelBarStyle, width: this.animatedInnerBarWidth }]} />
        </Animated.View>
        <Text style={[styles.strengthDescription, strengthDescriptionStyle, { ...strengthLevelLabelStyle }]}>{strengthLevelLabel}</Text>
      </View>
    );
  }
  
  render() {
    return (
      <View style={styles.wrapper}>
        {this.renderPasswordInput()}
        {this.renderPasswordStrength()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    height: 60,
    backgroundColor: 'transparent',
  },
  inputWrapper: {
    flex: 1,
    height: 40,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingTop: 7,
    paddingBottom: 10,
    fontSize: 20
  },
  passwordStrengthWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: "stretch",
    marginLeft: 10
  },
  passwordStrengthBar: {
    height: 10,
    position: 'relative',
    top: 5,
    bottom: 5,
    borderRadius: 5
  },
  innerPasswordStrengthBar: {
    height: 10,
    borderRadius: 5,
    width: 0
  },
  strengthDescription: {
    color: '#fff',
    backgroundColor: 'transparent',
    textAlign: 'right',
    position: 'absolute',
    right: 5,
    top: 1,
    fontSize: 14
  }
});

export {PasswordInputStrengthIndicator}