import React, { Component } from "react";
import "../App.scss";
import { useTable, useSortBy, usePagination } from "react-table";
import styled from "styled-components";

import CssBaseline from "@material-ui/core/CssBaseline";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { Input, Button } from '@material-ui/core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretDown, faWindowMaximize, faWindowMinimize } from '@fortawesome/free-solid-svg-icons'

const PRIMARY = "#212121";
const RED = "#d66061";
const GREEN = "#60d68a";
const BG = "#303030";

class PriceTable extends Component {
  constructor(props) {
    super(props);
    console.log(props.metadata)
    this.metadata = props.metadata;
    this.theme = createMuiTheme({
      palette: {
        primary: {500: RED},
        type: "dark"
      }
    });
  }

  render() {

    // subtract search bar, header, header, and footer heights...
    const TABLE_HEIGHT = this.props.height - 56 - 56 - 40 - 40;
    const TABLE_ROW_HEIGHT = 40;


    return (
      <div className="Sidebar">
        <ThemeProvider theme={this.theme}>
          <div className="Header">
            <img src={'./coins.png'} className="HeaderImage" alt=""/>
            <div className="Logo">OSRS Watch</div>
          </div>
        <div className="SearchBarContainer">
          <Input
            type="text"
            className="Searchbar"
            style={{ width: "100%" }}
            placeholder="Search..."
            onKeyDown={(e) => {
              if (e.which === 13 && !e.shiftKey) {
                  this.props.filterSidebar(e);
              }
          }}>

            </Input>
          <Button
            onClick={this.props.toggleExpand}
            className="ExpandButton">
              {
                this.props.expanded ?
                  <FontAwesomeIcon icon={faWindowMinimize}/> :
                  <FontAwesomeIcon icon={faWindowMaximize}/>
              }
          </Button>
        </div>
          <CssBaseline />

          <Table
            data={this.props.items}
            selected={this.props.activeItemId}
            metadata={this.metadata}
            onSelect={this.props.onSelect}
            formatGp={this.props.formatGp}
            pgSize={Math.round(TABLE_HEIGHT/TABLE_ROW_HEIGHT)}
            expanded={this.props.expanded}
          />
        </ThemeProvider>
      </div>
    );
  }
}

function Table({ data, metadata, onSelect, selected, formatGp, pgSize, expanded }) {

  
  const sorter = (row1, row2, id, desc) => {
    console.log(row1);
    console.log(row2);
    
  }

  let formatPercentChange = (val) => {
    let color;
    if (val < 0) {
      color = RED;
    } else if (val > 0) {
      color = GREEN;
    } else {
      color = "#fff";
    }
    return <span style={{"color" : color}}>{`${val}%`}</span>;
  }
  let basicColumns = [
    {
      Header: "Name",
      accessor: "name",
      Cell: row => {
        return (
          <div>
            <img
              height={24}
              style={{ marginBottom: "-8px" }}
              src={`data:image/png;base64,${row.row.original.icon}`}
              alt=""
            />
            {row.row.original.name}
          </div>
        );
      }
    },
    {
      Header: "Price",
      accessor: "daily",
      sortType: (row1, row2, y, z) => (row1.original.daily > row2.original.daily) ? 1 : -1,
      Cell: ({cell: {value}}) => formatGp(value)
      // Cell: row => {
      //   let color = row.row.original.oneDayChange > 0 ? GREEN : RED;
      //   let symbol = row.row.original.oneDayChange > 0 ? faCaretUp : faCaretDown;
      //   let fontSize = 16;
      //   if (row.row.original.oneDayChange === 0) {
      //     color = "steelblue";
      //     fontSize = 12;
      //     symbol = null;
      //   }
      //   return (
      //     <span>
      //       {`${formatGp(row.row.original.daily)} `}
      //       {
      //         symbol ? 
      //           <FontAwesomeIcon icon={symbol} style={{"color" : color, "fontSize" : fontSize}}/> :
      //           null
      //       }
           
      //     </span>);
      // }
    },
    {
      Header: "Volume",
      accessor: "volume",
      Cell: row => formatGp(row.row.original.volume)
    }
  ];

  let expandedColumns = [
    {
      Header: "Buy Limit",
      accessor: "buy_limit",
      Cell: ({cell: {value}}) => formatGp(value)
    },
    {
      Header: "High Alch. Value",
      accessor: "high_alch",
      Cell: ({cell: {value}}) => formatGp(value)
    },
    {
      Header: "High Alch. Profit",
      accessor: "high_alch_profit",
      sortType: (row1, row2, y, z) => (row1.original.high_alch_profit > row2.original.high_alch_profit) ? 1 : -1,
      Cell: ({cell: {value}}) => formatGp(value)
    },
  ]

  const columns = React.useMemo(
    () => expanded ? basicColumns.concat(expandedColumns) : basicColumns,
    [expanded, basicColumns, expandedColumns]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    pageOptions,
    page,
    state: { pageIndex},
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: pgSize}
    },
    useSortBy,
    usePagination
  );

  // Render the UI for your table
  return (
    <>
    <MaUTable {...getTableProps()}>
      <TableHead>
        {headerGroups.map(headerGroup => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <TableCell
                {...column.getHeaderProps(column.getSortByToggleProps())}
              >
                {column.render("Header")}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? " ↑" : " ↓") : ""}
                </span>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {page.map((row, i) => {
          prepareRow(row);
          return (
            <TableRow
              className={row.original.id === selected ? "PriceTableRow Selected" : "PriceTableRow" }
              onClick={() => {
                onSelect(row.original.id);
              }}
              {...row.getRowProps()}
            >
              {row.cells.map(cell => {
                return (
                  <TableCell {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </MaUTable>
    <div className="Footer">
      <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
        Prev
      </Button>
      <div>
        Page{' '}
        <em>
          {pageIndex + 1} of {pageOptions.length}
        </em>
      </div>
      <Button onClick={() => nextPage()} disabled={!canNextPage}>
        Next
      </Button>


    </div>
    </>
  );
}

export default PriceTable;
