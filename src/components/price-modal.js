import React from "react";
import Map from "../components/buyers/map";
import { withScriptjs } from "react-google-maps";
import Cookies from "js-cookie";

import {
  MDBContainer,
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalFooter
} from "mdbreact";
import cognitoUtils from "../lib/cognitoUtils";

const PriceModal = ({
  isActive,
  title,
  handleClose,
  isLogin,
  price,
  email,
  pickupAddress,
  dropoffAddress,
  handleSubmitOrder,
  weight,
  handleLogin
}) => {
  const MapLoader = withScriptjs(Map);
  return (
    <MDBContainer>
      <MDBModal isOpen={isActive}>
        <h5 class="card-header warning-color white-text text-center py-4">
            {!isLogin ? (<strong>Estimate Cost</strong>) :(<strong>Order Details</strong>)}
        </h5>
        {!isLogin && (
          <div>
            <div className="read-only md-form  padding-left-50 ">
              <p>
                <b>Source:</b> <span>{pickupAddress}</span>
              </p>
              <p>
                <b> Destination:</b> <span>{dropoffAddress}</span>
              </p>
              <p>
                <b> Weight:</b>
                <span> {weight}</span>
              </p>
              <p>
                <b>Shipping Cost: </b> <span>{price}</span>
              </p>
            </div>
  <MapLoader
  googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyB0KHdpL7Sv1nd61WVNaoABEzWbte3mswA"
  loadingElement={<div style={{ height: `100%` }}/>} origin={Cookies.get("pickupFormat")}  destination={Cookies.get('dropOffFormat')}/>
            <MDBModalBody>You must Login to proceed to Order</MDBModalBody>
          </div>
        )}
        {!isLogin ? (
          <MDBModalFooter className="modal-footer justify-content-center">
            <MDBBtn color="yellow" onClick={handleClose}>
              Close
            </MDBBtn>
            <MDBBtn
              color="primary"
              href={cognitoUtils.getCognitoSignInUri()}
              onClick={handleLogin}
            >
              Login
            </MDBBtn>
          </MDBModalFooter>
        ) : (
          <form
            onSubmit={handleSubmitOrder}
            className="text-center border border-light"
          >
              <div>
              <div className="read-only md-form  padding-left-50 ">
          <p>
          <b>Source:</b> <span>{pickupAddress}</span>
        </p>
        <p>
        <b> Destination:</b> <span>{dropoffAddress}</span>
        </p>
        <p>
        <b> Weight:</b>
        <span> {weight}</span>
        </p>
        <p>
        <b>Shipping Cost: </b> <span>{price}</span>
        </p>
        </div>
        <MapLoader
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyB0KHdpL7Sv1nd61WVNaoABEzWbte3mswA"
          loadingElement={<div style={{ height: `100%` }}/>} origin={Cookies.get("pickupFormat")}  destination={Cookies.get('dropOffFormat')}/>
        </div>
            <div>
              <input
                required
                className="form-inputs padding-50 input-alternate form-control mb-4"
                placeholder="Enter date "
                type="date"
                data-parse="date"
                name="pickup-date"
              />
            </div>
            <div>
              <input
                required
                className="form-inputs padding-50 input-alternate form-control mb-4"
                placeholder=" Sender Mobile"
                name="sender_mobile"
                data-parse="number"
                type="text"
              />
            </div>
            <div>
              <input
                required
                className="form-inputs padding-50 form-control mb-4"
                placeholder="Receiver mobile "
                name="receiver_mobile"
                data-parse="number"
                type="tel"
              />
            </div>
            <div>
              <input
                className="form-inputs padding-50 form-control mb-4"
                placeholder="Shipment Pickup Address "
                name="sender_address"
                type="text"
              />
            </div>
            <div>
              <input
                className="form-inputs padding-50 form-control mb-4"
                placeholder="Shipment Drop-off Address "
                type="text"
                name="receiver_address"
              />
            </div>
            <MDBModalFooter className="modal-footer justify-content-center">
              <MDBBtn color="yellow" onClick={handleClose}>
                Close
              </MDBBtn>
              <MDBBtn color="orange" type="submit">
                Submit
              </MDBBtn>
            </MDBModalFooter>
          </form>
        )}
      </MDBModal>
    </MDBContainer>
  );
};
export default PriceModal;
