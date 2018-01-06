import React, { Component } from "react";
import "./App.css";

import Map from "./Map";
import RouteTable from "./RouteTable";

const MAX_BUSES = 100;

// Google Maps data
const lat = 39.7401; // Denver, CO area
const lng = -104.9903;
const zoom = 10;

// Satori API data
const RTM = require("satori-rtm-sdk");
const endpoint = "wss://open-data.api.satori.com";
const satoriAppKey = "fccb04410069dD36D60ab4d5Daaa6b9F";
const channel = "transportation";
const AREA = "denver";

var satoriClient,
  outterCount = 0;

class App extends Component {
  state = {
    buses: {},
    lastClickedRoute: null,
  };

  initializeSatori = () => {
    satoriClient = new RTM(endpoint, satoriAppKey);

    satoriClient.on("enter-connected", function() {
      console.log("Connected to Satori Transpo API.");
    });

    var subscription = satoriClient.subscribe(channel, RTM.SubscriptionMode.SIMPLE);

    subscription.on("rtm/subscription/data", pdu => {

      // Filter out all transpo info except for what we're interested in
      const msgs = pdu.body.messages.filter(msg => {
        return msg.header["user-data"] === AREA;
      });

      // Make a new copy of all the buses
      let newBuses = Object.assign({}, this.state.buses);

      let innerCount = 0;

      // Grab the position of each bus and put it in state
      msgs.forEach(msg => {
        const v = msg.entity[0].vehicle;
        const busLabel = v.vehicle.label;
        const currentLNG = v.position.longitude;
        const currentLAT = v.position.latitude;

        // some bus info doesnt have route object with route ID, so filter them out
        if (v.trip) {
          const routeId = v.trip.route_id;
          if (newBuses[busLabel] || Object.keys(newBuses).length < MAX_BUSES) {
            newBuses[busLabel] = { lat: currentLAT, lng: currentLNG, routeId: routeId };
          }
          innerCount++;
        }
      });

      if (msgs.length) {
        this.setState({ buses: newBuses }, () => {
          console.log('new updates in.')
          // console.log("innerCount:" + innerCount, "size:" + Object.keys(this.state.buses).length);
        });
      }
    });

    satoriClient.start();
  };

  tableClick = e => {
    if (!e.target.dataset.label) return; // weed out bad clicks

    const lastClicked = e.target.dataset.label;
    const lastClickedRoute = e.target.textContent.split("-- ")[1];

    console.log("Click on bus ", lastClicked + ' - route ' + lastClickedRoute);
    this.setState({ lastClickedRoute: lastClickedRoute });
  };

  componentDidMount() {
    this.initializeSatori();
  }

  render() {
    const buses = this.state.buses;

    return (
      <div className="App">
        <Map lat={lat} lng={lng} zoom={zoom} {...this.state} />
        <RouteTable buses={buses} tableClickHandler={this.tableClick} />
      </div>
    );
  }
}

export default App;
