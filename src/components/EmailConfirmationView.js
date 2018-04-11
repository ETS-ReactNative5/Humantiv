import React, { Component } from "react";
import { View, Text, Platform} from "react-native";
import { connect } from "react-redux";
import Modal from "react-native-modal";
import {Button, HeaderImage, LinkText } from "./common";
import {
  ModalDialog 
} from './custom'; 
import { Actions } from "react-native-router-flux";
import { scale } from "react-native-size-matters";
import firebase from "react-native-firebase";
import Images from "../resources/images";
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { fetchUser } from "../actions";
import { theme, primaryBlueColor, primaryGreyColor, modalMessages} from './themes';


class EmailConfirmation extends Component {
  
  state = {
    visibleModal: false,
    textModal: modalMessages.continue
  };

  dismissModal() {
    this.setState({visibleModal: !this.state.visibleModal});
  }

  resendConfirmationEmail() {
    const firebaseUser = firebase.auth().currentUser;
    console.log(`user: ${firebaseUser}`);
    console.log('Email is not verified');
    firebase.auth().languageCode = 'en';
    firebaseUser.sendEmailVerification()
    .then(() => { 
      console.log(`ECV - Verification email sent`);
      this.setState({visibleModal: true, textModal: modalMessages.resend});
    })
    .catch((error) => {
      console.log(`ECV - Error sending verification email: ${error}`);
    });
  }

  confirmEmail() {
    var firebaseUser = firebase.auth().currentUser;

    if (firebaseUser) {
      firebaseUser.reload()
      .then(() => {
        firebaseUser = firebase.auth().currentUser;
        if (firebaseUser._user.emailVerified) {
          console.log('Email is verified');
          Actions.main();
          return;
        } else {
          this.setState({visibleModal: true, textModal: modalMessages.continue});
        }
      });    
    } else {
      Actions.auth();
    }
  }

  render() {
    const { user } = this.props;

    const { 
      pageStyle,
      ImageContainerStyle,
      buttonContainerStyle,
      navigationBarStyle,
      textContainerStyle,
      buttonStyle,
      linkContainerStyle,
      modalContent,
      modalStyle
    } = styles;

    return (
        <View style={pageStyle}>
          <View style={ImageContainerStyle} >
            <HeaderImage source={Images.img_login_email}/>
          </View>
          <View style={textContainerStyle} >
              <Text style={[theme.primaryGreyTextStyle, {fontSize: 24, fontWeight: 'bold', flex: 1}]}>
                Confirm your email address
              </Text>
              <Text style={[theme.primaryGreyTextStyle, {flex: 1}]}>
                We sent a confirmation email to:
              </Text>
             <Text style={[theme.primaryGreyTextStyle, {color: primaryBlueColor, flex: 1}]}>
                {(user) ? user.email : ""}
              </Text>
              <Text style={theme.primaryGreyTextStyle}>
                Check your email and click on the confirmation link to continue.
              </Text>
            </View>
          <View style={buttonContainerStyle} >
            <Button style={buttonStyle} onPress={this.confirmEmail.bind(this)}>
              Continue
            </Button>
          </View>
          <View style={linkContainerStyle} >
            <LinkText
              onPress={this.resendConfirmationEmail.bind(this)}
            >
              Resend confirmation email
            </LinkText>
          </View>
          <ModalDialog
            visible={this.state.visibleModal}
            label={this.state.textModal.message}
            cancelLabel={this.state.textModal.cancel}
            acceptLabel={this.state.textModal.accept}
            onCancelPress={this.dismissModal.bind(this)}
            onAcceptPress={this.dismissModal.bind(this)}
          >
          </ModalDialog>
        </View>
    );
  }
}

const styles = {
  pageStyle: {
    justifyContent: "space-around",
    flexDirection: "column",
    backgroundColor: '#fff',
    flex: 1
  },
  navigationBarStyle: {
    height: 60,
    paddingTop: 10,
    paddingLeft: 10,
    flex: 1
  },
  ImageContainerStyle: {
    flex: 4,
    padding: scale(40),
  },
  textContainerStyle: {
    flex: 4,
    alignItems: 'center',
    justifyContent: "center",
 //   backgroundColor: "yellow",
  },
  buttonStyle: {
    alignSelf: "stretch"
  },
  buttonContainerStyle: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: scale(10),
    paddingRight: scale(10)
  },
  linkContainerStyle: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: 'flex-end',
    height: 80,
    paddingBottom: 20
  }
};

const mapStateToProps = state => {
  const { user } = state.auth;

  return { user };
};

export default connect(mapStateToProps, { fetchUser })(EmailConfirmation);