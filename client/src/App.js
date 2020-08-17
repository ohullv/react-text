import React, { useEffect, useState } from "react";
import TextItem from "./TextItem";
import "./App.css";
import _ from "lodash";

// const DATA_SIZE_HALF = "half"
const DATA_SIZE_FULL = "full";
const INTERVAL_TIME = 2000;

/** Application entry point */
function App() {
  const [data, setData] = useState([]);
  const [value, setValue] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [responseHolder, setResponseHolder] = useState({});
  const [pageSize, setPageSize] = useState(5);

  /** DO NOT CHANGE THE FUNCTION BELOW */
  useEffect(() => {
    setInterval(() => {
      // Find random bucket of words to highlight
      setValue(Math.floor(Math.random() * 10));
    }, INTERVAL_TIME);
  }, []);
  /** DO NOT CHANGE THE FUNCTION ABOVE */

  useEffect(() => {
    const fetchData = async () => {
      let response = await fetch("/api/dataIdList?datasize=" + DATA_SIZE_FULL);
      let list = await response.json();
      responseHolder.list = list;
      setLastPage(responseHolder.list.length / pageSize);
      await loadPage();
    };

    fetchData();
  }, []);

  const loadPage = async () => {
    let pageFirstIx = (currentPage - 1) * pageSize;

    let pageLastIx = pageFirstIx + pageSize;
    let list = responseHolder.list.slice(pageFirstIx, pageLastIx);
    let dataItems = await Promise.all(
      list.map(async (id) => {
        return (await fetch("/api/dataItem/" + id)).json();
      })
    );
    setData(dataItems);
  };

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleNextPageClicked = async (e) => {
    let ableToProceed = currentPage < lastPage;
    if (ableToProceed) {
      setData([]);
      setCurrentPage(currentPage + 1);
      await loadPage();
    }
  };

  const handlePreviousPageCLicked = async (e) => {
    let ableToProceed = currentPage > 1;
    if (ableToProceed) {
      setData([]);
      setCurrentPage(currentPage - 1);
      await loadPage();
    }
  };

  return (
    <div className="App">
      <h2>JT Online Book</h2>
      <div>
        <input
          type="text"
          placeholder="Search text"
          value={searchInput}
          onChange={handleChange}
        />
      </div>
      <div>
        <button onClick={handlePreviousPageCLicked}>Previous</button>{" "}
        {currentPage} of {lastPage}{" "}
        <button onClick={handleNextPageClicked}> Next</button>
      </div>
      {data.map((row, i) => {
        return (
          <p key={`p${i}`}>
            {row.map((textitem, j) => {
              if (
                searchInput.length > 0 &&
                textitem.text.search(searchInput) === -1
              ) {
                return null;
              }

              return (
                <>
                  <TextItem key={`${i}${j}`} value={value} data={textitem} />
                </>
              );
            })}
          </p>
        );
      })}
    </div>
  );
}

export default App;
