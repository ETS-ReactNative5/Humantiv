import React from 'react';
import { 
  Text, 
  View,
  Dimensions,
  ScrollView
} from 'react-native';

import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { 
  Button,
  GraphCard,
  JourneyCard,
  JourneyChoice,
  SettingsHeader,
  SettingsTextEntry,
  SettingsSwitch,
  SettingsChoice,
  SettingsSection,
  SettingsDataSource,
  SettingsJourney,
  SettingsDate,
  SettingsTime,
  Date
} from '../../src/components/common';
import Feed from '../../src/components/common/Feed';
import { 
  HealthView, 
  SignUpButton, 
  FacebookLoginButton, 
  GoogleLoginButton,
  WeightManualLog,
  SleepManualLog,
  StressManualLog
} from '../../src/components/custom';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import CenterView from './CenterView';
import Welcome from './Welcome';
import { 
  primaryWhiteTextStyle, 
  primaryBlueColor, 
  primaryGreyColor,
  primaryGreenColor,
  Units
} from '../../src/components/themes';
import { scale } from "react-native-size-matters";
import {Icon} from '../../src/components/common/Icon';
import {formatHoursMinutes} from "../../src/business/Helpers";

const screenWidth = Dimensions.get('window').width;
const graphCardWidth = (screenWidth - 30)/2;

storiesOf('Welcome', module)
  .add('to Humantiv', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
  .add('Base', () => (
    <Button 
      onPress={action('clicked-signin')}
      style={{
        marginLeft:20,
        marginRight: 20
      }}
    >
      <Text style={primaryWhiteTextStyle}>Button</Text>
    </Button>
  )).add('Sign In', () => (
    <SignUpButton 
      onPress={action('clicked-signin')}
      style={{
        marginLeft:20,
        marginRight: 20
      }}
    >
      <Text style={primaryWhiteTextStyle}> Sign In </Text>
    </SignUpButton>
  ))
  .add('Connect with Facebook', () => (
    <FacebookLoginButton 
      onPress={action('clicked-login-facebook')}
      style={{
        marginLeft:20,
        marginRight: 20
      }}
      login='facebook'
    >
      <FontAwesome 
        style={{color: 'white'}}
      >
        {Icons.facebook}
        <Text style={primaryWhiteTextStyle}>  Connect with Facebook</Text>
      </FontAwesome>
    </FacebookLoginButton>
  ))
  .add('Connect with Google', () => (
    <GoogleLoginButton 
      onPress={action('clicked-login-google')}
      style={{
        marginLeft:20,
        marginRight: 20
      }}
      login='google'
    >
      <FontAwesome 
        style={{color: 'white'}}
      >
        {Icons.googlePlus}
        <Text style={primaryWhiteTextStyle}>  Connect with Google</Text>
      </FontAwesome>
    </GoogleLoginButton>
  ));

  storiesOf('Graph Card', module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
  .add('Green', () => (
    <GraphCard
      title= "Glucose"
      unit= "mg/dl"
      data= {[
          {time: 1, value: 112},
          {time: 2, value: 97}, 
          {time: 3, value: 96},  
          {time: 4, value: 95}, 
          {time: 5, value: 95},
          {time: 6, value: 97},
          {time: 7, value: 102}, 
          {time: 8, value: 94},  
          {time: 9, value: 98}, 
          {time: 10, value: 97}
        ]}
      rules= {{ 
          min: 0,
          max: 160,
          healthyMin: 61,
          healthyMax: 100
      }}
      width= {graphCardWidth}
      height= {graphCardWidth}
  />
  ))
  .add('Red', () => (
    <GraphCard
      title= "Weight"
      unit= "lbs"
      data= {[
          {time: 1, value: 367},
          {time: 2, value: 350}, 
          {time: 3, value: 257},  
          {time: 4, value: 220}, 
          {time: 5, value: 199}
      ]}
      rules= {{ 
          min: 120,
          max: 1000,
          healthyMin: 120,
          healthyMax: 190
      }}
      width= {graphCardWidth}
      height= {graphCardWidth}
    />
  ));

  storiesOf('Journey Card', module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
  .add('Unselected', () => (
    <JourneyCard
      size = {screenWidth -scale(40)}
      selected = {false}
      style = {{ marginBottom: 5}}
      onSelected = {() => {console.log("Selected")}}
    />
  )).add('Selected', () => (
    <JourneyCard
      size = {screenWidth -scale(40)}
      selected = {true}
      style = {{marginBottom: 5}}
      onSelected = {() => {console.log("Selected")}}
  />
  ));

  storiesOf('Journey Choice', module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
  .add('Selection', () => (
 
  <ScrollView>
    <JourneyChoice
    data= {[
      {
        title: "I want to function at a higher level in my work.",
        content: "We'll guide you on the path to more energy, high productivity, higher efficiency, and more satisfaction in your work.",
        icon: "graph"
      },
      {
        title: "I want to perform like an olympian.",
        content: "We'll personalize a fitness and nutritional strategy to hit your goals, no matter how Olympian-size they are.",
        icon: "trophee"
      },
      {
        title: "I want to be around to play with my grankids.",
        content: "We'll guide you on a journey to keep your muscles firm mind sharp, and ready to keep up with the grandkids.",
        icon: "blocks"
      },
      {
        title: "I want to boost my immune system to stop getting sick all the time",
        content: "We'll craft an immune boosting diet full of fruits, vegetables, and sunlight",
        icon: "head"
      },
    ]}
    style={{flex:1}}
    setSelected={(key)=>{console.log(key)}}
    />
    </ScrollView>
  ));

  storiesOf('Settings', module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
  .add('Header', () => (
    < SettingsHeader
    />
  ))
  .add('Text Entry', () => (
    < SettingsTextEntry
      label="Age"
      placeholder=""
      onChangeText= {(text) => {console.log(text)}}
      enablesReturnKeyAutomatically={true}
      returnKeyType="done"
      keyboardType="numeric"
      autoFocus={false}
      value="26"
      unit="years old"
    />
  ))
  .add('Text Entry Missing', () => (
    < SettingsTextEntry
      label="Age"
      placeholder=""
      onChangeText= {(text) => {console.log(text)}}
      enablesReturnKeyAutomatically={true}
      returnKeyType="done"
      keyboardType="numeric"
      autoFocus={false}
      missing="Needed for health score"
      unit="years old"
    />
  ))
  .add('Choice', () => (
    < SettingsChoice
      label="Gender"
      onSelect= {
        (value, label) => {console.log(value, label)}
      }
      textStyle={{flex:4}}
      value = "Male"
      choices = {["Male","Female","I'd rather not say"]}
    />
  ))
  .add('Switch', () => (
    < SettingsSwitch
      label="Goal Notifications"
      onValueChange= {
        (value) => {console.log(value)}
      }
      on = {true}
    />
  ))
  .add('Data Source', () => (
    <SettingsDataSource
      label= "Add data source"
      icon= "plus_blue"
      color= {primaryBlueColor}
      onPress={() => {console.log("Human API Call")}}
    />
  ))
  .add('Journey', () => (
    <SettingsJourney
      type= "longevity"
      color= {primaryGreenColor}
      onPress={() => {console.log("Change Journey")}}
      width={screenWidth}
    />
  ))
  .add('Date', () => (
    <SettingsDate
      label="Date"
      value="Today"
      onValidate={(date) => {console.log(`Change Date: ${date}`)}}
      width={screenWidth}
    />
  ))
  .add('Time', () => (
    <SettingsTime
    label="Time"
    onValidate={(time) => {console.log(`Change Date: ${time}`)}}
    width={screenWidth}
    />
  ))

  .add('Section', () => (
    <View>
      <ScrollView
      style={{
        flex: 1
      }}
      showsHorizontalScrollIndicator={false}
      horizontal={false}
      >
      < SettingsHeader
        name="Nabyl Bennouri"
        email="nabyl@citizenhealth.io"
        image="https://www.ienglishstatus.com/wp-content/uploads/2018/04/Anonymous-Whatsapp-profile-picture.jpg"
      />
      < SettingsSection
        title="Profile section"
      >
        < SettingsTextEntry
          label="Age"
          placeholder=""
          onChangeText= {(text) => {console.log("text")}}
          enablesReturnKeyAutomatically={true}
          returnKeyType="done"
          keyboardType="numeric"
          autoFocus={false}
          value="26"
          unit="years old"
          missing="Needed for the health score"
        />
        < SettingsChoice
        label="Gender"
        onSelect= {
          (value, label) => {console.log(value, label)}
        }
        textStyle={{flex:4}}
        value = "Male"
        choices = {["Male","Female","I'd rather not say"]}
      />
        < SettingsTextEntry
          label="Weight"
          placeholder=""
          onChangeText= {(text) => {console.log("text")}}
          enablesReturnKeyAutomatically={true}
          returnKeyType="done"
          keyboardType="numeric"
          autoFocus={false}
          value="83"
          unit="kg"
          missing="Needed for the health score"
        />
        < SettingsTextEntry
          label="Height"
          placeholder=""
          onChangeText= {(text) => {console.log("text")}}
          enablesReturnKeyAutomatically={true}
          returnKeyType="done"
          keyboardType="numeric"
          autoFocus={false}
          value="186"
          unit="cm"
          missing="Needed for the health score"
        />
      </SettingsSection>
      < SettingsSection
        title="Settings"
      >
        < SettingsChoice
          label="Height"
          onSelect= {
            (value, label) => {console.log(value, label)}
          }
          textStyle={{flex:4}}
          value = "Centimeters"
          choices = {["Centimeters","Inches"]}
        />
        < SettingsChoice
        label="Weight"
        onSelect= {
          (value, label) => {console.log(value, label)}
        }
        textStyle={{flex:4}}
        value = "Kilograms"
        choices = {["Kilograms","Lbs"]}
        />
        < SettingsChoice
          label="Distance"
          onSelect= {
            (value, label) => {console.log(value, label)}
          }
          textStyle={{flex:4}}
          value = "Meters"
          choices = {["Meters","Feet"]}
        />
      </SettingsSection>
      < SettingsSection
        title="Notifications"
      >
        < SettingsSwitch
          label="Goals Notifications"
          onValueChange= {
            (value) => {console.log(value)}
          }
          value = {true}
        />
        < SettingsSwitch
          label="Votes Notifications"
          onValueChange= {
            (value) => {console.log(value)}
          }
          value = {false}
        />
        < SettingsSwitch
          label="Wallet Notifications"
          onValueChange= {
            (value) => {console.log(value)}
          }
          value = {true}
        />
      </SettingsSection>
      < SettingsSection
        title="Data Sources"
      >
        <SettingsDataSource
          label= "Add data source"
          icon= "plus_blue"
          color= {primaryBlueColor}
          onPress={() => {console.log("Human API Call")}}
        />
      </SettingsSection>
      < SettingsSection
        title="Your Journey"
      >
        <SettingsJourney
          type= "immunity"
          color= {primaryGreenColor}
          onPress={() => {console.log("Change Journey")}}
        />
      </SettingsSection>
    </ScrollView>
  </View>
  ));
  storiesOf('Manual Measurement', module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
  .add('Weight', () => (
    < WeightManualLog
      value={50}
      onValidate= {(time, value, unit) => {console.log(`Date: ${time - value - unit}`)}}
      units={Units.Weight.Pounds}
    />
  ))
  .add('Sleep', () => (
    < SleepManualLog
      onValidate= {(day, time) => {console.log(`Date: ${day} - ${formatHoursMinutes(time)}`)}}
    />
  ))
  .add('Stress', () => (
    < StressManualLog
      value={50}
      onValidate= {(time, value, unit) => {console.log(`Date: ${time - value - unit}`)}}
      units={Units.Weight.Pounds}
    />
  ))


