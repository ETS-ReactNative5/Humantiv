import React, {Component} from "react";
import { 
    Platform, 
    StyleSheet, 
    View, 
    Text, 
    TouchableOpacity,
    Linking,
    ScrollView,
    Dimensions,
    Share       
} from 'react-native';
import { scale } from "react-native-size-matters";
import {connect} from "react-redux";
import FontAwesome, { Icons } from 'react-native-fontawesome';
import HGraph, { hGraphConvert, calculateHealthScore }  from 'react-native-hgraph';
import {
    Avatar, 
    IconButton,
    PriceGraphCard,
    Card,
    WalletCard,
    GraphCard,
    Icon,
    EarnMedits
} from './common';
import Feed from "./common/Feed";
import { Actions } from "react-native-router-flux";
import { 
    dataAdd,
    dataSave,
    dataFetch,
    walletFetch,
    addFeedStory
  } from "../actions";
import {Fonts} from '../resources/fonts/Fonts';
import firebase from "react-native-firebase";
import { 
  theme,
  graphGreyColor,
  primaryBlueColor,
  primaryBackgroungColor
 } from './themes';
import {formatNumbers} from '../business/Helpers';
import {primaryWhiteColor, primaryGreyColor} from './themes/theme';
import LinearGradient from 'react-native-linear-gradient';

class WalletView extends Component {

    constructor(props) {
      super(props);

      var dataArray = new Array();
      for (var i = 0; i<200; i++) {
//        dataArray[i] = 3000+(500*Math.round(Math.random()*100)/100-250)+ 3*i;
        dataArray[i] = 1;
      }

      this.state = {
        data: [1]
      }
    }
    componentWillMount () {
        this.props.walletFetch({type: "wallet"});
        firebase.analytics().setCurrentScreen('My Wallet Screen', 'WalletView');
        this.refreshData();
    }

    refreshData() {
      var dataArray = new Array();
      for (var i = 0; i<200; i++) {
         dataArray[i] = 1;
      }
      this.setState({data: dataArray});
    }

    redeemMedits = () => {
        this.refreshData();
    }

    share = () => {
      const {children} = this.props;

    // Check if user data is not set
    if (!firebase.app().auth().currentUser.uid) {
      console.log('User not authenticated');
      return;
    }

    const shared = (children.share && children.share.app !== undefined) ? children.share.app + 1 : 0;
    this.props.dataSave({type: "share", data: {app: shared}});

    let referalLink = `https://humantiv.page.link/invite`
    // Create dynamic link
    const link = new firebase.links.DynamicLink(referalLink, 'humantiv.page.link')
      .android.setPackageName('io.citizenhealth.humantiv')
      .android.setFallbackUrl('https://humantiv.com')
      .ios.setBundleId('io.citizenhealth.humantiv')
      .ios.setAppStoreId('1347054342')
      .social.setTitle(this.props.share_title)
      .social.setDescriptionText(this.props.share_message)
      .social.setImageUrl('https://citizenhealth.io/wp-content/uploads/2018/07/Humantiv.jpg');

    if (Platform.OS === 'android') {
        firebase.links()
  //      .createShortDynamicLink(link, 'UNGUESSABLE')
        .createDynamicLink(link)
        .then((url) => {
          console.log(url);
          // Share the invitation link
          Share.share(
          {
            title: this.props.share_title,
            message: `${this.props.share_message} ${url}`,
            dialogTitle: "Share Humantiv"
          })
          .then(result =>  {          
            this.props.dataAdd({type: "wallet", item: "medits", data: 10});
            // Add medit to feed
            const story = {
              title: "Sharing earned you",
              preposition: "",
              value: `10 Medits`,
              time: Math.round((new Date()).getTime() / 1000),
              type: "medits"
            }
            this.props.addFeedStory(story);
            console.log(result)
          })
          .catch(errorMsg => {
            console.log(errorMsg)
          });
        })
        .catch(errorMsg => {
          console.log(errorMsg)
        });
      } else {
        firebase.links()
        .createShortDynamicLink(link, 'UNGUESSABLE')
        .then((url) => {
          console.log(url);
          // Share the invitation link
          Share.share(
          {
            title: this.props.share_title,
            message: `${this.props.share_message} ${url}`,
            dialogTitle: "Share Humantiv"
          })
          .then(result =>  {          
            console.log(result);
            this.props.dataAdd({type: "wallet", item: "medits", data: 10});
            // Add medit to feed
            const story = {
              title: "Sharing earned you",
              preposition: "",
              value: `10 Medits`,
              time: Math.round((new Date()).getTime() / 1000),
              type: "medits"
            }
            this.props.addFeedStory(story);
            console.log(result)
          })
          .catch(errorMsg => {
            console.log(errorMsg)
          });
        })
        .catch(errorMsg => {
          console.log(errorMsg)
        });
      }
    }
    
    renderGraphCard() {
        const {children} = this.props;
        const {
          cardsStyle
        } = styles;

      const medits = (children.wallet) ? (children.wallet.medits ? children.wallet.medits : 0) : 0;
      const mdx = (children.wallet) ? (children.wallet.mdx ? children.wallet.mdx : 0) : 0;
      const screenWidth = Dimensions.get('window').width;
      const valueCardWidth = (screenWidth - 30)/2;
      const hgraphWidth = screenWidth - 120;
      return (
          <View style={{flex: 1}}>
              <View style={cardsStyle}>
                  <WalletCard 
                      color= "#3ba4f9"
                      icon= "medit"
                      title= "Medit Balance"
                      value= {formatNumbers(medits.toString())}
                      width= {valueCardWidth}
                  />
                  <TouchableOpacity 
                    style={{width: valueCardWidth}} 
                    onPress={() => Linking.openURL('https://citizenhealth.io/for-investors/')}
                  >
                    <WalletCard
                        color= "#34d392"
                        icon= "medex"
                        title= "MDX Balance"
                        value= "Invest"
                        width= {valueCardWidth}
                    />
                  </TouchableOpacity>
              </View>
              {this.renderEarnMedits()}
              <PriceGraphCard 
                  data= {this.state.data}
                  style={{
                  type: "medit",
                  graphColor: "blue",
                  backgroundColor: "#fff"
                  }}
              />
            </View>
            );
    }

    renderEarnMedits() {
      const {
        earnMeditsGradientContainerStyle,
        earnMeditsContainerStyle,
        earnMeditsTextStyle,
        cardStyle
    } = styles;

      return (
        <View style={{
            borderRadius: 3,
            borderTopWidth: 0,
            borderBottomWidth: 0,
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.8,
            shadowColor: "#3ba4f9",
            shadowRadius: 5,
            flex: 1}}
          >
          <LinearGradient 
            style={[earnMeditsGradientContainerStyle, {
              overflow: 'hidden',
            }]}
            start={{x: 0.0, y: 0.5}} end={{x: 1.0, y: 0.5}}
            colors={['rgba(59, 163, 249,1)','rgba(84, 210, 249,0.7)']}
//            colors={(Platform.OS === 'android') ? [graphGreyColor, primaryGreyColor] : ['rgba(59, 163, 249,1)','rgba(84, 210, 249,0.7)']}
          >
            <TouchableOpacity 
              style={earnMeditsContainerStyle} 
              onPress={() => this.share()}
            >
              <FontAwesome
                style={{fontSize: 24, color: primaryWhiteColor}}
              > 
                {Icons.shareAlt}
              </FontAwesome>
              <Text style={earnMeditsTextStyle}>
                Share and Earn 10 Medit
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )
    }

    renderRedeem() {
      const {
          cardFooterButtonTitleStyle,
          footerContainerStyle,
          cardTitleContainerStyle
      } = styles;

      const {
        iconTextStyle
      } = theme;  

      return (
        <View style={footerContainerStyle}>
            <View style={cardTitleContainerStyle}>
            <IconButton
                  onPress={() => {this.redeemMedits();}}
                  viewStyles={{disabled: true}}
                  textStyles={[iconTextStyle, {color:primaryBlueColor}]}
                  disabled
                >
                <FontAwesome
                  style={{color: primaryGreyColor}}
                > 
                  {Icons.shoppingCart}
                </FontAwesome>
              </IconButton>
              <Text style={cardFooterButtonTitleStyle}>
                Redeem Medits
              </Text>
            </View>
        </View>
      )
    }

    render() {
        const {
            pageStyle,
            headerStyle,
            textStyle
        } = styles;

        return (
          <View style={pageStyle}>
              <ScrollView >                   
                <View style={headerStyle}>
                  <Text style={textStyle}> Wallet </Text>               
                </View>
                   {this.renderGraphCard()} 
                  {this.renderRedeem()}                
              </ScrollView >     
          </View>
      );
    }
}

const styles = StyleSheet.create({
    pageStyle: {
        backgroundColor: primaryBackgroungColor,
        flexDirection: "column",
        alignItems: "stretch",
        flex: 1
    },
    headerStyle: {
        flexDirection: 'row',
        justifyContent: "space-between",
        height: scale(60),
        alignItems: 'center',
        alignContent: 'stretch'
    },
    cardStyle: {
      borderRadius: 3
    },  
    textStyle: {
        flex: 4,
        textAlign: 'center',
        fontSize: 20,
        color: graphGreyColor,
        fontFamily: Fonts.regular
    },
    cardsStyle: {
        flex: 1,
        justifyContent: "space-between",
        alignContent: "center",
        flexDirection: "row",
        marginLeft: 10,
        marginRight: 10
    },
    earnMeditsContainerStyle: {
      flex: 1,
      justifyContent: "space-around",
      alignItems: "center",
      flexDirection: "row",
    },
    earnMeditsGradientContainerStyle: {
      flex: 1,
      borderRadius: 5,
      justifyContent: "space-around",
      alignItems: "center",
      flexDirection: "row",
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10,
      height: 45,
      elevation: 1
    },
    earnMeditsTextStyle: {
      fontSize: 18,
      fontWeight: "400",
      color: primaryWhiteColor,
      fontFamily: Fonts.regular
    },
    cardTitleContainerStyle: {
      justifyContent: "center",
      alignItems: 'center',
      flexDirection: "row",
      paddingLeft: 15
    },  
    cardFooterButtonTitleStyle: {
      fontSize: 14,
      fontWeight: "400",
      color: graphGreyColor,
      fontFamily: Fonts.regular
    },
    footerContainerStyle: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: 60,
    }
});

const mapStateToProps = (state) => {
    const {user} = state.auth;
    const {children} = state.data;
    const {share_title, share_message} = state.config.configuration;

    return {
        user, children, share_title, share_message
    }
}
export default connect(mapStateToProps, {dataAdd, dataFetch, dataSave, walletFetch, addFeedStory})(WalletView);