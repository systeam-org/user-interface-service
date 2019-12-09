import React from "react";
import { MDBDataTable } from "mdbreact";

const OrdersList = ({ orders }) => {
  console.log("orders", orders);
  const columns = [
    {
      label: "OrderId",
      field: "ID",
      sort: "asc",
      width: 30
    },
    {
      label: "user email",
      field: "U_Email",
      sort: "asc",
      width: 150
    },
    {
      label: "Origin Address",
      field: "O_Address",
      sort: "asc",
      width: 150
    },
    {
      label: "Destination Address",
      field: "D_Address",
      sort: "asc",
      width: 150
    },
    {
      label: "Price",
      field: "Price",
      sort: "asc",
      width: 30
    },
    {
      label: "Origin Mobile",
      field: "O_Mobile",
      sort: "asc",
      width: 150
    },
    {
      label: "Destination contact",
      field: "D_Mobile",
      sort: "asc"
    },
    {
      label: "weight ",
      field: "Weight",
      sort: "asc"
    },
    {
      label: "Order Date",
      field: "O_Date",
      sort: "asc"
    },
    {
      label: "Pickup Date",
      field: "P_Date",
      sort: "asc"
    }
  ];
  const data = {
    columns: columns,
    rows: orders
  };

  return <MDBDataTable maxHeight="450px" bordered small data={data} striped />;
};

export default OrdersList;
