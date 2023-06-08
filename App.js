import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Dimensions, Button, Alert, FlatList, Component, Image, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import
MaterialCommunityIcons
  from 'react-native-vector-icons/MaterialCommunityIcons';
import
FaIcon
  from 'react-native-vector-icons/FontAwesome';
import { Card } from 'react-native-paper';
import Moment from 'moment';
import moment from 'moment';


var { width } = Dimensions.get('window');
var { height } = Dimensions.get('window');
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

var news = [
];
var newsImage = [
];
var category = "";
var newsMap = [];
var newsMapSearch = [];
var newsMapCategory = [];
var detailsTitle;
var detailsDescription;
var detailsImage;
var detailsUrl;
var detailsSource;
var detailsDate;
var language = false;
var search;

export default function App({ navigation }) {

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Feed"
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: '#A7C7E7' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { height: height * 0.07 },
          tabBarActiveBackgroundColor: "#A7C7E7",
          tabBarInactiveBackgroundColor: "#A7C7E7",
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'HomeStack') {
              iconName = focused
                ? 'home-circle'
                : 'home-circle-outline';
            } else if (route.name === 'CategoryStack') {
              iconName = focused
                ? 'animation'
                : 'animation-outline';
            }
            return (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={color}
              />
            );
          }
        })}>
        <Tab.Screen
          name="HomeStack"
          component={HomeStack}
          options={{
            tabBarLabel: 'Gündem',
            title: 'GÜNDEM',
            tabBarItemStyle: { paddingBottom: 8, paddingTop: 8 }
          }} />
        <Tab.Screen
          name="CategoryStack"
          component={CategoryStack}
          options={{
            tabBarLabel: 'Kategoriler',
            title: 'Kategori',
            tabBarItemStyle: { paddingBottom: 8, paddingTop: 8 }

          }} />

      </Tab.Navigator>
    </NavigationContainer>

  );
}

function CategoryStack() {
  return (
    <Stack.Navigator
      initialRouteName="CategoryScreen"
      screenOptions={{
        headerStyle: { backgroundColor: '#42f44b' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}>
      <Stack.Screen
        name="CategoryScreen"
        component={CategoryScreen}
        options={{ title: '', height: 0, headerTransparent: true, headerStyle: { backgroundColor: "#FF000000" } }}
      />
      <Stack.Screen
        name="HScreen"
        component={HScreen}
        options={{ title: 'Ana Sayfa', headerTransparent: true, headerStyle: { backgroundColor: "#FF000000" } }}
      />
      <Stack.Screen
        name="SecondScreen"
        component={SecondScreen}
        options={{ title: 'Kategori Detay', headerStyle: { backgroundColor: "gray" } }}
      />
      <Stack.Screen
        name="searchScreen"
        component={SearchScreen}
        options={{ title: 'Arama Sonucu', headerStyle: { backgroundColor: "gray" } }}
      />

    </Stack.Navigator>
  );
}
function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="HScreen"
      screenOptions={{
        headerStyle: { backgroundColor: '#42f44b' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}>

      <Stack.Screen
        name="HScreen"
        component={HScreen}
        options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: "#FF000000" } }}
      />
      <Stack.Screen
        name="SecondScreen"
        component={SecondScreen}
        options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: "#FF000000" } }}
      />
      <Stack.Screen
        name="DetailsScreen"
        component={DetailsScreen}
        options={{ title: 'Detay', headerStyle: { backgroundColor: "gray" } }}
      />
    </Stack.Navigator>
  );
}
class HScreen extends React.Component {

  navigate(title, details, image, date, source, url) {
    detailsTitle = title;
    detailsImage = image;
    detailsDescription = details;
    detailsDate = date;
    detailsSource = source;
    detailsUrl = url;
    this.props.navigation.navigate('DetailsScreen')

  }
  constructor() {
    super()
    getNewsFromApiAsync();

    this.state = {
      data: "",
      timePassed: false,
      lang: false,
    }
  }
  componentDidMount() {
    setTimeout(() => {
      this.setTimePassed();
    }, 1500);
  }
  changeLang() {
    language = !language;

    getNewsFromApiAsync();
    setTimeout(() => {
      this.setState({ lang: true });
    }, 1500);

  }
  setTimePassed() {
    this.setState({ timePassed: true });
  }
  render() {
    if (!this.state.timePassed) {
      return (<View>

        <Text>Yükleniyor</Text>
      </View>);
    }

    return (
      <View style={{}}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width, marginTop: height * 0.04, paddingRight: width * 0.03 }}>
          <View style={{ flexDirection: 'column', }} >
            <Text style={[{ fontWeight: '500', fontSize: 20, paddingTop: height * 0.0, paddingBottom: height * 0.02, alignContent: 'flex-start', alignItems: 'flex-start', alignSelf: 'flex-start', paddingLeft: width * 0.03, color: "black" }]}>
              HABERLER
            </Text>
            <Text style={[{ fontWeight: '600', fontSize: 15, paddingTop: height * 0.00, paddingBottom: height * 0.02, paddingRight: width * 0.03, color: "#A7C7E7", paddingLeft: width * 0.03, }]}>
              TARİH: {newsMap[0]["date"] == null ? "" : newsMap[0]["date"].substring(0, 10)}
            </Text>
          </View>

          <View onTouchStart={() => this.changeLang()} style={{ flexDirection: 'row', width: width * 0.35, height: height * 0.05, backgroundColor: "#A7C7E7", borderRadius: 10 }} >
            <Text style={[{ fontWeight: '400', fontSize: 15, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginRight: width * 0.03, height: height * 0.05, marginLeft: width * 0.03, marginTop: height * 0.02, marginRight: width * 0.03 }]}>Dil Değiştir </Text>
            <Image onTouchStart={() => this.changeLang()} source={{ uri: language ? "https://i4.hurimg.com/i/hurriyet/75/1200x675/55ea65fdf018fbb8f87d5486.jpg" : 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Flag_of_Turkey.svg/2000px-Flag_of_Turkey.svg.png' }}
              style={{ width: width * 0.06, height: height * 0.025, marginRight: width * 0.033, alignSelf: 'center' }} />
          </View>

        </View>

        <FlatList
          data={newsMap}
          renderItem={({ item }) =>
            <View onTouchEnd={() => this.navigate(item.key, item.description, item.image, item.date, item.source, item.url)}>
              <Card style={[styles.container,
              {
                flexDirection: 'row',
                justifyContent: "flex-start",
                alignItems: "flex-start",
                alignContent: "flex-start",
                alignSelf: "flex-start",
              },]}>
                <View style={{ flex: 2, }} >
                  <Image source={{ uri: item.image }}
                    style={{ height: height * 0.15, overflow: "hidden", borderRadius: 10, width: width * 0.35 }} />
                </View>
                <View style={{
                  flexDirection: 'column', flex: 3, width: width * 0.5, marginLeft: width * 0.37, height: height * 0.15, justifyContent: "flex-start",
                  alignItems: "flex-start",
                  alignContent: "flex-start",
                  alignSelf: "flex-start",
                  marginBottom: height * 0.1
                }} >
                  <Text style={[{ alignContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start', textAlignVertical: 'top', height: height * 0.09 }]}>{item.key}</Text>
                  <View
                    style={{
                      flexDirection: 'row', width: width * 0.5, height: height * 0.05, justifyContent: "space-between",
                      alignItems: "flex-start",
                      alignContent: "flex-start",
                      alignSelf: "flex-start",
                    }} >
                    <Text style={[{ fontStyle: "italic", color: "grey" }]}>Saat: {item.date.substring(11, 16)}</Text>
                    <Text style={[{ fontStyle: "italic", color: "grey" }]}>{item.source}</Text>

                  </View>

                </View>

              </Card></View>
          }
        />


      </View>
    );
  }
}


class CategoryScreen extends React.Component {
  navigate = (text) => {
    category = text;
    this.props.navigation.navigate('SecondScreen')
  }
  search = () => {
    this.props.navigation.navigate('searchScreen')
    setTimeout(() => {
      this.setTimePassed();
    }, 700);

  }
  onChangeNumber = (text) => {
    search = text;
    this.setState({ value: text })
  }

  constructor() {
    super()

    this.state = {
      data: "",
      timePassed: false,
      value: "",
    }
  }
  componentDidMount() {
    setTimeout(() => {
      this.setTimePassed();
    }, 700);
  }
  setTimePassed() {
    this.setState({ timePassed: true });
  }
  render() {

    return (
      <View style={{}}>
        <View style={[{
          flexDirection: 'row', paddingLeft: 20, paddingTop: 30, paddingBottom: 10
        }]}
        >
          <FaIcon name="search" size={25} alignSelf="center"></FaIcon>
          <TextInput
            activeUnderlineColor="green"
            underlineColor="purple"
            style={{
              marginLeft: 20,
              color: '#555555',
              paddingRight: 10,
              paddingLeft: 20,
              paddingTop: 5,
              height: height * 0.06,
              width: '70%',
              borderColor: '#6E5BAA',
              borderWidth: 1,
              borderRadius: 10,

              backgroundColor: '#ffffff'
            }}
            onChangeText={this.onChangeNumber}
            placeholder="Haber Ara"
            onSubmitEditing={this.search}

          />
        </View>

        <Text
          style={[,
            {
              height: height * 0.07,
              width: width * 0.5,
              fontSize: 25,
              fontWeight: '700',
              textAlign: 'center',
              textAlignVertical: 'center',
              marginTop: height * 0.02

            },]}
        >KATEGORİLER</Text>
        <View style={[{ flexDirection: 'row', marginTop: height * 0.02, paddingLeft: 20, height: height * 0.12, backgroundColor: "#ff696180" }]}
          onTouchEnd={() =>
            this.navigate("sport")}
        >
          <FaIcon name="soccer-ball-o" size={30} alignSelf="center"></FaIcon>
          <Text
            style={[,
              {
                height: height * 0.1,
                width: width * 0.75,
                fontSize: 25,

                textAlign: 'center',
                textAlignVertical: 'center',
                alignSelf: 'center',


              },]}
          >Spor</Text>
          <FaIcon name="angle-right" size={40} alignSelf="center"></FaIcon>
        </View>

        <View style={[{ flexDirection: 'row', paddingLeft: 20, height: height * 0.12, backgroundColor: "#add8e690" }]}
          onTouchEnd={() => this.navigate("technology")}
        >
          <FaIcon name="ravelry" size={30} alignSelf="center"></FaIcon>
          <Text
            style={[,
              {
                height: height * 0.08,
                width: width * 0.75,
                fontSize: 25,

                textAlign: 'center',
                textAlignVertical: 'center',
                alignSelf: 'center',


              },]}
          >Teknoloji</Text>
          <FaIcon name="angle-right" size={40} alignSelf="center"></FaIcon>

        </View>
        <View style={[{ flexDirection: 'row', paddingLeft: 20, height: height * 0.12, backgroundColor: "#C1E1C199" }]}
          onTouchEnd={() => this.navigate("economy")}
        >
          <FaIcon name="money" size={30} alignSelf="center"></FaIcon>
          <Text
            style={[,
              {
                height: height * 0.08,
                width: width * 0.75,
                fontSize: 25,

                textAlign: 'center',
                textAlignVertical: 'center',
                alignSelf: 'center',


              },]}
          >Ekonomi</Text>
          <FaIcon name="angle-right" size={40} alignSelf="center"></FaIcon>

        </View>

        <View style={[{ flexDirection: 'row', paddingLeft: 20, height: height * 0.12, backgroundColor: "#f0e68c95" }]}
          onTouchEnd={() => this.navigate("health")}
        >
          <FaIcon name="medkit" size={30} alignSelf="center"></FaIcon>
          <Text
            style={[,
              {
                height: height * 0.08,
                width: width * 0.75,
                fontSize: 25,

                textAlign: 'center',
                textAlignVertical: 'center',
                alignSelf: 'center',


              },]}
          >Sağlık</Text>
          <FaIcon name="angle-right" size={40} alignSelf="center"></FaIcon>


        </View>

        <View style={[{ flexDirection: 'row', paddingLeft: 20, height: height * 0.12, backgroundColor: "#C3B1E195" }]}
          onTouchEnd={() => this.navigate("entertainment")}
        >
          <FaIcon name="film" size={30} alignSelf="center"></FaIcon>
          <Text
            style={[,
              {
                height: height * 0.08,
                width: width * 0.75,
                fontSize: 25,

                textAlign: 'center',
                textAlignVertical: 'center',
                alignSelf: 'center',


              },]}
          >Eğlence</Text>
          <FaIcon name="angle-right" size={40} alignSelf="center"></FaIcon>

        </View>
      </View>
    );
  }
}

class SecondScreen extends React.Component {
  navigate(title, details, image, date, source, url) {
    detailsTitle = title;
    detailsImage = image;
    detailsDescription = details;
    detailsDate = date;
    detailsSource = source;
    detailsUrl = url;
    this.props.navigation.navigate('DetailsScreen')

  }
  search = () => {
    searchNewsFromApiTRAsync(this.state.value);
    setTimeout(() => {
      this.setTimePassed();
    }, 700);

  }
  onChangeNumber = (text) => {
    this.setState({ value: text })
  }

  constructor() {
    super()
    searchNewsFromApiTRAsync("a");

    this.state = {
      data: "",
      timePassed: false,
      value: "",
    }
  }
  componentDidMount() {
    setTimeout(() => {
      this.setTimePassed();
    }, 2500);
  }
  setTimePassed() {
    this.setState({ timePassed: true });
  }
  render() {
    if (!this.state.timePassed) {
      return (
        <View>
          <Text style={styles.item}>Yükleniyor</Text>
        </View>
      );
    }
    return (
      <View style={{}}>

        <FlatList
          data={newsMapCategory}
          renderItem={({ item }) =>
            <View onTouchEnd={() => this.navigate(item.key, item.description, item.image, item.date, item.source, item.url)}>
              <Card style={[styles.container,
              {
                flexDirection: 'row',
                justifyContent: "flex-start",
                alignItems: "flex-start",
                alignContent: "flex-start",
                alignSelf: "flex-start",
              },]}>
                <View style={{ flex: 2, }} >
                  <Image source={{ uri: item.image }}
                    style={{ height: height * 0.15, overflow: "hidden", borderRadius: 10, width: width * 0.35 }} />
                </View>
                <View style={{
                  flexDirection: 'column', flex: 3, width: width * 0.5, marginLeft: width * 0.37, height: height * 0.15, justifyContent: "flex-start",
                  alignItems: "flex-start",
                  alignContent: "flex-start",
                  alignSelf: "flex-start",
                  marginBottom: height * 0.1
                }} >
                  <Text style={[{ alignContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start', textAlignVertical: 'top', height: height * 0.09 }]}>{item.key}</Text>
                  <View
                    style={{
                      flexDirection: 'row', width: width * 0.5, height: height * 0.05, justifyContent: "space-between",
                      alignItems: "flex-start",
                      alignContent: "flex-start",
                      alignSelf: "flex-start",
                    }} >
                    <Text style={[{ fontStyle: "italic", color: "grey" }]}>Saat: {item.date.substring(11, 16)}</Text>
                    <Text style={[{ fontStyle: "italic", color: "grey", }]}>{item.source}</Text>

                  </View>

                </View>

              </Card>
            </View>
          }
        />


      </View>
    );
  }
}
class SearchScreen extends React.Component {
  navigate(title, details, image, date, source, url) {
    detailsTitle = title;
    detailsImage = image;
    detailsDescription = details;
    detailsDate = date;
    detailsSource = source;
    detailsUrl = url;
    this.props.navigation.navigate('DetailsScreen')

  }
  search = () => {

    setTimeout(() => {
      this.setTimePassed();
    }, 700);

  }
  onChangeNumber = (text) => {
    this.setState({ value: text })
  }

  constructor() {
    super()
    getNewsFromApiTRAsync(search);

    this.state = {
      data: "",
      timePassed: false,
      value: "",
    }
  }
  componentDidMount() {
    setTimeout(() => {
      this.setTimePassed();
    }, 2500);
  }
  setTimePassed() {
    this.setState({ timePassed: true });
  }
  render() {
    if (!this.state.timePassed) {
      return (
        <View>
          <Text style={styles.item}>Yükleniyor</Text>
        </View>
      );
    }
    return (
      <View style={{}}>

        <FlatList
          data={newsMapSearch}
          renderItem={({ item }) =>
            <View onTouchEnd={() => this.navigate(item.key, item.description, item.image, item.date, item.source, item.url)}>
              <Card style={[styles.container,
              {
                flexDirection: 'row',
                justifyContent: "flex-start",
                alignItems: "flex-start",
                alignContent: "flex-start",
                alignSelf: "flex-start",
              },]}>
                <View style={{ flex: 2, }} >
                  <Image source={{ uri: item.image }}
                    style={{ height: height * 0.15, overflow: "hidden", borderRadius: 10, width: width * 0.35 }} />
                </View>
                <View style={{
                  flexDirection: 'column', flex: 3, width: width * 0.5, marginLeft: width * 0.37, height: height * 0.15, justifyContent: "flex-start",
                  alignItems: "flex-start",
                  alignContent: "flex-start",
                  alignSelf: "flex-start",
                  marginBottom: height * 0.1
                }} >
                  <Text style={[{ alignContent: 'flex-start', alignSelf: 'flex-start', alignItems: 'flex-start', textAlignVertical: 'top', height: height * 0.09 }]}>{item.key}</Text>
                  <View
                    style={{
                      flexDirection: 'row', width: width * 0.5, height: height * 0.05, justifyContent: "space-between",
                      alignItems: "flex-start",
                      alignContent: "flex-start",
                      alignSelf: "flex-start",
                    }} >
                    <Text style={[{ fontStyle: "italic", color: "grey" }]}>Saat: {item.date.substring(11, 16)}</Text>
                    <Text style={[{ fontStyle: "italic", color: "grey", }]}>{item.source}</Text>

                  </View>

                </View>

              </Card>
            </View>
          }
        />


      </View>
    );
  }
}
class DetailsScreen extends React.Component {

  constructor() {
    super()

  }
  render() {

    return (
      <View style={{ flexDirection: 'column', }}>
        <Image source={{ uri: detailsImage }}
          style={{ height: height * 0.2, width: width }} />
        <View style={{ flexDirection: 'row', justifyContent: "flex-end", paddingRight: width * 0.1, paddingTop: height * 0.005 }}>
          <Text style={[{ fontWeight: '500', fontSize: 14, fontStyle: "italic", color: "gray" }]}>TARİH:  {detailsDate.substring(0, 10)}  </Text>
          <Text style={[{ fontWeight: '500', fontSize: 14, fontStyle: "italic", color: "gray" }]}>{detailsDate.substring(11, 16)}</Text>
        </View>

        <Text style={[{ fontWeight: '600', fontSize: 20, marginLeft: width * 0.05, marginRight: width * 0.05, marginTop: height * 0.008 }]} >{detailsTitle}</Text>
        <Text style={[{ color: "#2b2b2b", fontWeight: '400', fontSize: 16, marginLeft: width * 0.05, marginRight: width * 0.05, marginTop: height * 0.015 }]}>{detailsDescription}</Text>
        <Text style={{ alignSelf: 'flex-end', paddingRight: width * 0.1, fontWeight: '500', fontSize: 18, color: "gray", marginTop: height * 0.05 }}>{detailsSource}</Text>

        <View onTouchEnd={() => Linking.openURL(detailsUrl)} style={{ flexDirection: 'row', width: width * 0.6, height: height * 0.07, backgroundColor: "#A7C7E7", alignSelf: 'center', borderRadius: 10, marginTop: height * 0.09, marginBottom: height * 0.1 }}>
          <Text style={{ alignSelf: 'center', fontSize: 17, fontWeight: '500', marginLeft: width * 0.05 }}>Haber Kaynağına Git</Text>
          <FaIcon name="arrow-right" size={30} alignSelf="center" style={{ marginLeft: width * 0.05 }}></FaIcon>
        </View>

      </View>
    );
  }
}

const getNewsFromApiAsync = async () => {
  try {
    var apilang;
    if (language) {
      apilang = "en";
    }
    else {
      apilang = "tr";
    }

    const response = await fetch(
      "https://api.collectapi.com/news/getNews?country=" + apilang + "&tag=general",
      {
        method: "post",
        headers: new Headers({

          'Authorization': "apikey 40RbcxFEE2s5CgYzlUwaOl:56Ue81VYc5AGiXtt1kJNQj",
          'Content-Type': 'application/json'
        }),

      }
    ).then().catch(err => { console.log(err) });
    const json = await response.json();
    await setNewsList(json)
    return json;
  } catch (error) {
    console.error(error);
  }
};
const searchNewsFromApiTRAsync = async (text) => {
  try {
    var apilang;
    if (language) {
      apilang = "en";
    }
    else {
      apilang = "tr";
    }

    const response = await fetch(
      "https://api.collectapi.com/news/getNews?country=" + apilang + "&tag=" + category,
      {
        method: "post",
        headers: new Headers({

          'Authorization': "apikey 40RbcxFEE2s5CgYzlUwaOl:56Ue81VYc5AGiXtt1kJNQj",
          'Content-Type': 'application/json'
        }),

      }
    ).then().catch(err => { console.log(err) });
    const json = await response.json();
    await setNewsListCategory(json)
    return json.articles;
  } catch (error) {
    console.error(error);
  }
};
const getNewsFromApiTRAsync = async (text) => {
  try {
    if (language) {
      apilang = "en";
    }
    else {
      apilang = "tr";
    }
    var dt = new Date();
    dt = moment(dt).subtract(1, 'day');
    Moment.locale('tr');
    const response = await fetch(
      "https://newsapi.org/v2/everything?q=' + text + '&from=' + Moment(dt).format('yyyy-DD-MM') + '&sortBy=publishedAt&apiKey=dc74d71871414a56bdcb79e6aa947c81",
    );
    const json = await response.json();
    await setNewsListSearch(json)
    return json.articles;
  } catch (error) {
    console.error(error);
  }
};
const setNewsListSearch = async (json) => {

  for (let i = 0; i < json["articles"].length; i++) {
    newsMapSearch[i] = {
      "key": json["articles"][i]["title"] ?? "",
      "image": json["articles"][i]["urlToImage"] ?? "",
      "source": json["articles"][i]["author"] ?? "",
      "date": json["articles"][i]["publishedAt"] ?? "",
      "description": json["articles"][i]["description"] ?? "",
      "url": json["articles"][i]["url"] ?? "",

    }


  }
}
const setNewsList = async (json) => {

  for (let i = 0; i < json["result"].length; i++) {
    newsMap[i] = {
      "key": json["result"][i]["name"],
      "image": json["result"][i]["image"],
      "source": json["result"][i]["source"],
      "date": json["result"][i]["date"],
      "description": json["result"][i]["description"],
      "url": json["result"][i]["url"],

    }
    news[i] = json["result"][i]["name"] ?? "";
    newsImage[i] = json["result"][i]["image"];


  }
}
const setNewsListCategory = async (json) => {

  for (let i = 0; i < json["result"].length; i++) {
    console.log(json["result"][i]["name"]);
    newsMapCategory[i] = {
      "key": json["result"][i]["name"],
      "image": json["result"][i]["image"],
      "source": json["result"][i]["source"],
      "date": json["result"][i]["date"],
      "description": json["result"][i]["description"],
      "url": json["result"][i]["url"],
    }
    news[i] = json["result"][i]["name"] ?? "";
    newsImage[i] = json["result"][i]["image"];


  }
}
const styles = StyleSheet.create({
  container: {
    height: height * 0.13,
    width: width * 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: height * 0.3,
    borderRadius: 10,
    borderWidth: 0,
    borderColor: "FF000000",
    height: height * 0.15,
    width: width * 0.9,
    marginTop: height * 0.02,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,

  },
});
