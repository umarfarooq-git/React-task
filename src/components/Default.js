import React, { useState, useEffect } from "react";
import DataGri from "./DataGrid";
import Navfun from "./Navbar";
import Avatar from "@mui/material/Avatar";
import { toBePartiallyChecked } from "@testing-library/jest-dom/dist/matchers";
const columns = [
  { field: "name", headerName: "NAME", width: 400 },
  { field: "typeName", headerName: "TYPES", width: 500 },
  {
    field: "img",
    headerName: "Image",
    width: 400,
    editable: true,
    renderCell: (params) => <Avatar alt="Loading issue" src={params.value} />, // renderCell will render the component
  },
];

const Default = () => {
  const [tableData, setTableData] = useState([]);
  const [newTableData, setNewTableData] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState();
  var dataSet = null;

  useEffect(() => {
    loadData();
  }, []);

  var loadData = async () => {
    if (!dataSet) {
      let data = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=300");
      data = await data.json();
      var typesArray = [];

      for (let i = 0; i < data.results.length; i++) {
        let singleData = data.results[i];
        //splitting id from url
        const urlArr = singleData.url.split("/");
        singleData.id = urlArr[urlArr.length - 2];
        var imageUrl =
          "https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/" +
          singleData.id +
          ".svg";
        //Fetching IMGs
        let res = await fetch(imageUrl);
        var imageBlob = await res.blob();
        var imageObjectURL = URL.createObjectURL(imageBlob);
        singleData.img = imageObjectURL;
        //Fetching types
        let typesData = await fetch(singleData.url);
        typesData = await typesData.json();
        // d.types = data.results fire,water,
        var typeName = "";
        singleData.types = [];
        typesData.types.map((type, i) => {
          if (!typesArray.includes(type.type.name)) {
            typesArray.push(type.type.name);
          }
          i < 1
            ? (typeName += type.type.name)
            : (typeName += "," + type.type.name);
          singleData.types.push(type.type.name);
        });
        singleData.typeName = typeName;
      }

      data.results.typeSet = typesArray;
      dataSet = data.results;
      setTableData(dataSet);
    }
  };

  useEffect(() => {
    if (selectedTypes !== undefined) {
      var newData = [];
      tableData?.map((task) => {
        var check = selectedTypes.some((item) => task.types.includes(item));
        if (check) {
          newData.push(task);
        }
      });
      setNewTableData(newData);
    }
  }, [selectedTypes]);

  return (
    <div>
      <Navfun />
      {tableData.typeSet ? (
        <div className="row">
          <div
            className="col-md-2 text-center"
            style={{ padding: "20px", color: "white", backgroundColor: "gray" }}
          >
            <h5>Select any type</h5>
            <select
              className="form-control"
              multiple
              onChange={(e) => {
                let value = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                setSelectedTypes(value);
              }}
            >
              {tableData?.typeSet?.map((time) => {
                return <option value={time}> {time} </option>;
              })}
            </select>
          </div>
          <div className="col-md-10" style={{ padding: "20px" }}>
            <h5>Table data</h5>
            {tableData.typeSet ? (
              <DataGri
                columns={columns}
                data={newTableData.length > 0 ? newTableData : tableData}
              />
            ) : null}
          </div>
        </div>
      ) : (
        <p>Data is loading... Please Wait</p>
      )}
    </div>
  );
};

export default Default;
