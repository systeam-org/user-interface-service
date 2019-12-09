import React from "react";
import { MDBContainer, MDBRow, MDBCol, MDBBtn} from "mdbreact";
import { Form } from "react-bootstrap";

const VendorUpdatePrice = ({
  sourceList,
  destinationList,
  handleUpdatePrice
}) => {
  return (
    <MDBContainer>
      <MDBRow>
        <MDBCol md="6">
          <form onSubmit={handleUpdatePrice}>
            <p className="h5 text-center mb-4">Update Price</p>
            <Form.Group>
              <Form.Label>Source </Form.Label>
              <select className="form-control" name="sourcedivision">
                {sourceList.map((v, i) => (
                  <option key={1} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Destination</Form.Label>
              <select className="form-control" name="destinationdivision">
                {destinationList.map((v, i) => (
                  <option key={i} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </Form.Group>
            <Form.Group name="price">
              <Form.Label>Price</Form.Label>
              <input
                type="text"
                name="price"
                className="form-control"
                required
              />
            </Form.Group>

            <div className="text-center">
              <MDBBtn color="orange" type="submit">
                Update Price
              </MDBBtn>
            </div>
          </form>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default VendorUpdatePrice;
