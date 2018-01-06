import React, { Component } from "react";
import "./Map.css";

import GoogleMapReact from "google-map-react";

const Marker = ({ text, highLight }) => {
  let classes = "fadeAble marker ";
  classes += highLight ? 'clicked ' : 'normal ';
  return (
    <div className={classes} >
      {text}
    </div>
)};


class Map extends Component {

  render() {
    const { lat, lng, zoom, buses, lastClickedRoute } = this.props;
    let allBuses = [];

    for ( const bus in buses ) {
        allBuses.push(<Marker
          key={bus}
          text={bus}
          highLight={ (buses[bus].routeId === lastClickedRoute) }
          lat={buses[bus].lat}
          lng={buses[bus].lng}
        />)
    }

    return (
      <div style={{ width: "100%", height: "500px" }}>
        <GoogleMapReact  center={{ lat: lat, lng: lng }} zoom={zoom}>
          { allBuses }
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;
