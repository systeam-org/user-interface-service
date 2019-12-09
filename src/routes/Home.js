/* disable-eslint   no-unused-vars ,eslint-disable no-undef */
import React, { Component} from "react";
import { connect } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import Autocomplete from "react-google-autocomplete";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import "./Home.css";
import cognitoUtils from "../lib/cognitoUtils";
import appConfig from "../config/app-config.json";
import { getZipcode, getParams } from "../utils/utils";
import PriceModal from "../components/price-modal";
import Vendor from "../routes/vendor";
import ChatBot from "../components/buyers/chatbot";
import Cookies from "js-cookie";
import {
  ESTIMATE,
  ADD_USER,
  PLACE_ORDER
} from "../constants/api-constant";

import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavLink,
  MDBNavbarToggler,
  MDBCollapse,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBIcon,
  MDBView,
  MDBInput
} from "mdbreact";
const mapStateToProps = state => {
  return { session: state.session };
};

const inputParsers = {
  date(input) {
    const [month, day, year] = input.split("/");
    return `${year}-${month}-${day}`;
  },
  uppercase(input) {
    return input.toUpperCase();
  },
  number(input) {
    return parseFloat(input);
  }
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiStatus: "Not called",
      uploadStatus: false,
      isOpen: false,
      pickupZipcode: "",
      dropoffZipcode: "",
      weight: "",
      gmapsLoaded: false,
      address: "",
      modalActive: false,
      dropoffAddress: "",
      pickupAddress: "",
      email: "",
      name: "",
      price: "",
      modalOpen: false
    };
    this.autocomplete = null;
    this.handleSubmitCheckPrice = this.handleSubmitCheckPrice.bind(this);
    this.handleChangePickupCity = this.handleChangePickupCity.bind(this);
    this.handleChangeDropOffCity = this.handleChangeDropOffCity.bind(this);
    this.handleChangeWeight = this.handleChangeWeight.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleSubmitOrder = this.handleSubmitOrder.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  initMap = () => {
    this.setState({
      gmapsLoaded: true
    });
  };

  componentDidMount() {
    window.initMap = this.initMap;
    const gmapScriptEl = document.createElement(`script`);
    gmapScriptEl.src = `https://maps.googleapis.com/maps/api/js?key=${appConfig.googleAPIKey}&libraries=places&callback=initMap`;
    document
      .querySelector(`body`)
      .insertAdjacentElement(`beforeend`, gmapScriptEl);
    const { session } = this.props;
    if (this.props.session.isLoggedIn) {
      const options = {
        url: `${appConfig.apiUri}/list?firstName=${session.user.firstName}&lastName=${session.user.lastName}`,
        headers: {
          Authorization: `Bearer ${this.props.session.credentials.accessToken}`
        }
      };

      this.setState({ apiStatus: "Loading..." });
    }
    if (window.location.href.includes("id_token")) {
      const token = window.location.hash.replace("#id_token=", "");

      var base64Url = token.split(".")[1];
      var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      var jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function(c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      const fisrtName = JSON.parse(jsonPayload).given_name;
      const lastName = JSON.parse(jsonPayload).family_name;

      const name = fisrtName + " " + lastName;
      const email = JSON.parse(jsonPayload).email;
      Cookies.set("name", name);
      Cookies.set("email", email);
      this.setState({ name: name, email: email, isLogin: true });
      axios.post(ADD_USER, {
        u_email: email,
        last_name: lastName,
        first_name: fisrtName
      });
    }

  }

  handleLogin(e) {

    this.setState({ modalActive: true });
  }

  handleSubmitCheckPrice(event) {
    const { pickupZipcode, dropoffZipcode, weight } = this.state;
    event.preventDefault();

    axios
      .get(ESTIMATE, {
        params: {
          origin: pickupZipcode,
          destination: dropoffZipcode,
          weight: weight
        },
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      })
      .then(res => {
        this.setState({ price: res.data.price });
        Cookies.set("price", res.data.price);
        Cookies.set("modalOpen", true);
        this.setState({ modalActive: true });
      });
  }

  onSignOut = e => {
    e.preventDefault();
    cognitoUtils.signOutCognitoSession();
  };

  handleChangePickupCity(place) {
    const pickupZipcode = getZipcode(place.address_components);
    this.setState({
      pickupZipcode: pickupZipcode,
      pickupAddress: place.address_components[0].long_name
    });
    Cookies.set("pickupZipcode", pickupZipcode);
    Cookies.set("pickupAddress", place.address_components[0].long_name);
    Cookies.set("pickupFormat",place.formatted_address)
  }
  handleChangeDropOffCity(place) {
    const dropoffZipcode = getZipcode(place.address_components);
    this.setState({
      dropoffZipcode: dropoffZipcode,
      dropoffAddress: place.address_components[0].long_name
    });
    Cookies.set("dropoffZipcode", dropoffZipcode);
    Cookies.set("dropoffAddress", place.address_components[0].long_name);
    Cookies.set("dropOffFormat",place.formatted_address)
  }
  handleChangeWeight(event) {
    this.setState({ weight: event.target.value });
    Cookies.set("weight", event.target.value);
  }
  handleCloseModal() {
    this.setState({ modalActive: false });
    Cookies.set("modalOpen", false)
    Cookies.set("price", "", -1);
    Cookies.set("weight", "", -1);
    Cookies.set("dropoffZipcode", "", -1);
    Cookies.set("dropoffAddress", "", -1);
    Cookies.set("pickupZipcode", "", -1);
    Cookies.set("pickupAddress", "", -1);
    Cookies.set("dropOffFormat", "", -1);
    Cookies.set("pickupAddress", "", -1);
  }

  handleSubmitOrder(event) {
    const { pickupZipcode, weight, dropoffZipcode, email } = this.state;
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);

    for (let name of data.keys()) {
      const input = form.elements[name];
      const parsedValue = data.get(input.name);
      data.set(name, parsedValue);
    }
    const o_date = new Date();
    const orederPayload = {
      origin: Cookies.get("pickupZipcode"),
      destination: Cookies.get("dropoffZipcode"),
      u_email: Cookies.get("email"),
      o_address: data.get("sender_address"),
      d_address: data.get("receiver_address"),
      o_mobile: data.get("sender_mobile"),
      d_mobile: data.get("receiver_mobile"),
      p_date: data.get("pickup-date"),
      o_date: o_date.toLocaleDateString(),
      weight: Cookies.get("weight")
    };
    axios({
      method: "post",
      url: PLACE_ORDER,
      data: orederPayload
    }).then(res => {
      this.setState({ modalActive: false });
      Cookies.set("modalOpen", false)
      Swal.fire({
        position: "top-middle",
        icon: "success",
        title: "Order has been placed successfully",
        text: `Shipping Cost: ${res.data.price} \n Order Id: ${res.data.id} \n
        Vendor Email: ${res.data.v_email} \n Vendor Name: ${res.data.v_name} \n Vendor Mobile:${res.data.v_mobile}`,
        timer: 5000
      });
    });
  }

  onSignOut = e => {
    e.preventDefault();
    cognitoUtils.signOutCognitoSession();
    Cookies.set('name','');
    Cookies.set('email','');
  };

  render() {
    const type = getParams(window.location.href).type;
    return (
      <div className="App" ref={el => (this.div = el)}>
        {type == "vendor" && this.state.isLogin ? (
            <Vendor />
        ) : (
        <div>
        <MDBView>
          <MDBNavbar dark expand="md" className="navigation-bar">
            <MDBNavbarBrand>
              <strong className="white-text">SysteamBiz</strong>
            </MDBNavbarBrand>
            <MDBNavbarToggler onClick={this.toggleCollapse} />
            <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
              {Cookies.get('name') && (
                <MDBNavbarNav left>
                  <MDBNavItem>
                  <MDBNavLink to="/" onClick={this.redirectHome}> Place Order </MDBNavLink>
                  </MDBNavItem>
                  <MDBNavItem active>
                    <MDBNavLink to ="/buyer/orders" className="navlink">
                      {" "}
                      <strong className="white-text">Orders</strong>{" "}
                    </MDBNavLink>
                  </MDBNavItem>
                </MDBNavbarNav>
              )}

              {!Cookies.get('name') ? (
                <MDBNavbarNav right>
                  <MDBNavItem>
                    <MDBDropdown>
                      <MDBDropdownToggle nav caret>
                        Login
                      </MDBDropdownToggle>
                      <MDBDropdownMenu className="dropdown-default">
                        <MDBDropdownItem>
                          <a href={cognitoUtils.getCognitoSignInUriForVendor()}>Vendor </a>
                        </MDBDropdownItem>
                        <MDBDropdownItem>
                          <a href={cognitoUtils.getCognitoSignInUri()}>
                            Customer{" "}
                          </a>
                        </MDBDropdownItem>
                      </MDBDropdownMenu>
                    </MDBDropdown>
                  </MDBNavItem>
                </MDBNavbarNav>
              ) : (
                <MDBNavbarNav right>
                  <MDBNavItem>
                    {" "}
                    <strong className="white-text">
                      Welcome {Cookies.get("name")}
                    </strong>
                  </MDBNavItem>
                  <MDBNavItem onClick={this.onSignOut} className="navlink">
                    <strong className="white-text">Logout</strong>
                  </MDBNavItem>
                </MDBNavbarNav>
              )}
            </MDBCollapse>
          </MDBNavbar>
          <div className="check-price-form-container">
            <ChatBot />
            <MDBContainer className="check-price-form">
              <MDBRow end>
                <MDBCol md="4" className="right-container">
                  <MDBCard>
                    <MDBCardBody>
                      <form onSubmit={this.handleSubmitCheckPrice}>
                        <div className="grey-text">
                          {this.state.gmapsLoaded && (
                            <section>
                              <div className="md-form">
                                <MDBIcon
                                  icon="map-marker-alt"
                                  size="2x"
                                  className="orange-text map-icons"
                                  prefix
                                />
                                <Autocomplete
                                  className="form-control form-inputs"
                                  name="pickup"
                                  placeholder="PickUp City"
                                  onPlaceSelected={place =>
                                    this.handleChangePickupCity(place)
                                  }
                                  types={["address"]}
                                />
                              </div>
                              <div className="md-form">
                                <MDBIcon
                                  icon="map-marker-alt"
                                  size="2x"
                                  className="orange-text  map-icons"
                                  prefix
                                />
                                <Autocomplete
                                  className="form-control form-inputs"
                                  name="dropoff"
                                  styles={["padding-left:40px"]}
                                  placeholder="DropOff City"
                                  onPlaceSelected={place =>
                                    this.handleChangeDropOffCity(place)
                                  }
                                  types={["address"]}
                                />
                              </div>
                              <div className="md-form">
                                <MDBIcon
                                  icon="balance-scale"
                                  size="lg"
                                  className="orange-text map-icons"
                                  prefix
                                />
                                <input
                                  className="form-inputs padding-50"
                                  placeholder="Enter weight (Kg)"
                                  type="text"
                                  onChange={this.handleChangeWeight}
                                />
                              </div>
                            </section>
                          )}
                        </div>
                        <div className="text-center py-4 mt-3">
                          <MDBBtn color="orange" type="submit">
                            Check Instant price
                          </MDBBtn>
                        </div>
                      </form>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </div>
          {(this.state.modalActive || Cookies.get("modalOpen") === true ||Cookies.get("modalOpen") === "true" ) && (
            <PriceModal
              isActive={true}
              handleClose={this.handleCloseModal}
              isLogin={this.state.isLogin}
              pickupZipcode={Cookies.get("pickupZipcode")}
              weight={Cookies.get("weight")}
              dropoffZipcode={Cookies.get("dropoffZipcode")}
              originAdress={Cookies.get("originAdress")}
              pickupAddress={Cookies.get("pickupAddress")}
              price={Cookies.get("price")}
              dropoffAddress={Cookies.get("dropoffAddress")}
              handleSubmitOrder={this.handleSubmitOrder}
              handleLogin={this.handleLogin}
            />
          )}
        </MDBView>
        </div>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps)(Home);
