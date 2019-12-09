import React, { Component } from "react";
import Cookies from "js-cookie"
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavLink,
  MDBCollapse,
  MDBView
} from "mdbreact";
import cognitoUtils from "../lib/cognitoUtils";
import OrderList from "../components/buyers/orders";
import axios from "axios";
import {ORDERS} from "../constants/api-constant";


class Vendors extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: []
    };

    this.redirectHome =this.redirectHome.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    axios.get(ORDERS, {
      params:{
        u_email: Cookies.get("email"),
        type:"buyer"
      }
    }).then(res => this.setState({orders:res.data}));

  }

  redirectHome(){
    this.props.history.push('/')
  }
  handleLogout(){
    cognitoUtils.signOutCognitoSession();
    Cookies.set('name','');
    Cookies.set('email','');
  }



  render() {
    const {orders, divisons} =this.state;
    return (
      <div>
      <MDBView>
      <Router>
      <MDBNavbar dark expand="md" className="navigation-bar">
      <MDBNavbarBrand>
      <strong className="white-text">  SysteamBiz
      </strong>
      </MDBNavbarBrand>
      <MDBCollapse id="navbarCollapse3" isOpen={true} navbar>
    <MDBNavbarNav left>
    <MDBNavItem>
    <MDBNavLink to="/" onClick={this.redirectHome}> Place Order </MDBNavLink>
    </MDBNavItem>
    <MDBNavItem active>
    <MDBNavLink to="/buyer/orders"> Orders </MDBNavLink>
      </MDBNavItem>
      </MDBNavbarNav>
      <MDBNavbarNav right>
    <MDBNavItem>
    <strong className="white-text">
        Welcome {Cookies.get("name")}
  </strong>
    </MDBNavItem>
    <MDBNavItem active>
    <MDBNavItem onClick={this.handleLogout} className="navlink">
      <strong className="white-text">Logout</strong>
      </MDBNavItem>
      </MDBNavItem>
      </MDBNavbarNav>
      </MDBCollapse>
      </MDBNavbar>
      <Switch>
    <Route key="orders" path="/buyer/orders">
      <div className="order-container">
      <OrderList orders={orders} />
      </div>
      </Route>
      </Switch>
      </Router>
      </MDBView>
      </div>
  );
  }
}
export default Vendors;
