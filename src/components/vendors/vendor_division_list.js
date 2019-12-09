import React from "react";
import {MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";


const VendorDivisionList = props => {

  const allowed1 = ['Central1', 'Central2','East1','East2', 'North1','North2','North3','NorthEast1','NorthEast2','South1','South2','South3','West1','West2','SourceDivision'];

  const filtered = props.leastPrices.map(raw => Object.keys(raw)
      .filter(key => allowed1.includes(key))
.reduce((obj, key) => {
    obj[key] = raw[key];
  return obj;
}, {}));
  const sorted = filtered.map((ele,i) => Object.keys(ele)
      .sort()
      .reduce((acc, key) => ({
      ...acc, [key]: props.leastPrices[i][key].Price
}), {"key": ele['SourceDivision']}));


  const allowed = [{label:""},{label:'Central1'}, {label:'Central2'},{label:'East1'},
    {label:'East2'}, {label:'North1'},{label:'North2'}, {label:'North3'},
    {label:'NorthEast1'},{label:'NorthEast2'},
    {label:'South1'}, {label:'South2'}, {label:'South3'},{label:'West1'},{label:'West2'}].sort();


  return (
    <MDBTable striped bordered hover>
      <MDBTableHead columns={allowed} />
      <MDBTableBody rows={sorted} />
    </MDBTable>
  );
};

export default VendorDivisionList;
