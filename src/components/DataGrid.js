import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";

const DataGri = (props) => {
  return (
    <div style={{ height: 700, width: "100%" }}>
      <DataGrid
        getRowId={(row) => row.url}
        rows={props.data}
        columns={props.columns}
        pageSize={12}
      />
    </div>
  );
};

export default DataGri;
