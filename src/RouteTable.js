import React, { Component } from "react";
import "./RouteTable.css";

const Row = ({ label, route }) => (
  <p data-label={label} className="tableEntry">
    {label} -- {route}
  </p>
);

class RouteTable extends Component {
  render() {
    const { buses, tableClickHandler } = this.props;
    const allBuses = [];
    for (const bus in buses) {
      allBuses.push(<Row key={bus} label={bus} route={buses[bus].routeId} />);
    }

    if ( Object.keys(buses).length < 1 ) {
      return (<div>Querying Transpo API, please wait...</div>);
    }

    return (
      <section  style={{ width: "100%", textAlign: "left" }}>
        <p style={{ fontSize: '13px' }}>Bus Label -- Route ID</p>
        <div className="columns" onClick={ tableClickHandler } >
          {allBuses}
        </div>
        <p>Click on a bus to highlight all buses on that same route in the map.</p>
      </section>

    );
  }
}

export default RouteTable;
