import React, { Component, forwardRef } from "react";
import { connect } from "react-redux";
import axios from "axios";
import cognitoUtils from "../lib/cognitoUtils";
import appConfig from "../config/app-config.json";

class Customer extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div>Customer</div>;
  }
}

const mapStateToProps = state => {
  return { session: state.session };
};
export default connect(mapStateToProps)(Customer);
