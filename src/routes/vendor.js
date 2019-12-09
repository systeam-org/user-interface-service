import React, { Component } from "react";
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
import OrderList from "../components/vendors/orders";
import Cookies from "js-cookie";
import VendorUpdatePrice from "../components/vendors/vendor_update_price_form";
import VendorDivisonList from "../components/vendors/vendor_division_list";
import axios from "axios";
import cognitoUtils from "../lib/cognitoUtils";
import Swal from "sweetalert2";
import {
  ORDERS,
  DIVISIONS,
  UPDATE_PRICE,
  LEAST_ORDER
} from "../constants/api-constant";

class Vendors extends Component {
  constructor(props) {
    super(props);

    this.state = {
      vemail: "",
      vname:"",
      orders: [],
      divisons: [],
      leastPrices: [],
      isLogin: false
    };
    this.handleUpdatePrice = this.handleUpdatePrice.bind(this);
    this.onSignOutForVendor =this.onSignOutForVendor.bind(this);
  }

  componentDidMount() {
    if (window.location.href.includes("id_token")) {
      const token = window.location.hash.replace("#id_token=", "");

      var base64Url = token.split(".")[1];
      var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      var jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      const vname = JSON.parse(jsonPayload).name;
      const vemail = JSON.parse(jsonPayload).email;
      const vphone = JSON.parse(jsonPayload).phone_number;
      this.setState({vname: vname, vemail: vemail, isLogin: true});

      axios
        .get(LEAST_ORDER)
        .then(res => this.setState({leastPrices: res.data}));
      axios
        .get(ORDERS, {
          params: {
            v_email: vemail,
            type: "vendor"
          }
        })
        .then(res => this.setState({orders: res.data})
    );
      axios
        .get(DIVISIONS, {
          params: {
            v_email: vemail
          }
        })
        .then(res => this.setState({divisons: res.data})
    );
    }
  }

  onSignOutForVendor = e => {
    e.preventDefault();
    cognitoUtils.signOutCognitoSessionVendor();
    Cookies.set('name','');
    Cookies.set('email','');
  }
  handleUpdatePrice(event) {

    const { vemail, leastPrices } = this.state;
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);

    for (let name of data.keys()) {
      const input = form.elements[name];
      const parsedValue = data.get(input.name);
      data.set(name, parsedValue);
    }
    const updatePricePayload = {
      v_email: vemail,
      sourcedivision: data.get("sourcedivision"),
      destinationdivision: data.get("destinationdivision"),
      price: data.get("price")
    };
    axios({
      method: "post",
      url: UPDATE_PRICE,
      data: updatePricePayload
    }).then(res => {
     if(res.status === 201)
  {
    Swal.fire({
      position: "top-middle",
      icon: "error",
      title: "You have entered price higher than existing least price.\nYour Price has not been updated.",
      showConfirmButton: false,
      timer: 4000
    });
  }else{
    Swal.fire({
      position: "top-middle",
      icon: "success",
      title: "Your price has been updated successfully. ",
      showConfirmButton: false,
      timer: 4000
    });
  }
  axios
    .get(LEAST_ORDER)
    .then(res => this.setState({leastPrices: res.data}));
    });
  }

  render() {
    const { orders, divisons, leastPrices,isLogin } = this.state;
    return (
      <div>
        <MDBView>
          <Router>
            <MDBNavbar dark expand="md" className="navigation-bar">
              <MDBNavbarBrand>
                <strong className="white-text"> SysteamBiz</strong>
              </MDBNavbarBrand>
              <MDBCollapse id="navbarCollapse3" isOpen={true} navbar>
                <MDBNavbarNav left>
                  <MDBNavItem active>
                    <MDBNavLink to="/"> <b>Home</b> </MDBNavLink>
                  </MDBNavItem>
                  <MDBNavItem>
                    <MDBNavLink to="/vendors/updatePrice">
                      {" "}
                     <b> Update Price </b>{" "}
                    </MDBNavLink>
                  </MDBNavItem>
                  <MDBNavItem>
                    <MDBNavLink to="/vendors/orders"><b> Orders</b> </MDBNavLink>
                  </MDBNavItem>
                </MDBNavbarNav>
      <MDBNavbarNav right>
        <MDBNavItem>
        {" "}
        <strong className="white-text">
            Welcome {this.state.vname}
      </strong>
        </MDBNavItem>
    <MDBNavItem active>
  <MDBNavItem onClick={this.onSignOutForVendor} className="navlink">
    <strong className="white-text">Logout</strong>
    </MDBNavItem>
      </MDBNavItem>
        </MDBNavbarNav>
              </MDBCollapse>
            </MDBNavbar>
            <Switch>
              <Route exact key="home" path="/">
                {leastPrices && <VendorDivisonList leastPrices={leastPrices} />}
              </Route>
              <Route key="updatePrice" path="/vendors/updatePrice">
                <VendorUpdatePrice
                  sourceList={divisons}
                  destinationList={divisons}
                  handleUpdatePrice={this.handleUpdatePrice}
                />
              </Route>
              <Route key="orders" path="/vendors/orders">
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
