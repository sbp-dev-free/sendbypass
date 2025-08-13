"use client";
import React, { FC, useState } from "react";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { Icon } from "@/components";

import { CollapsibleTableProps } from "./types";

export const CollapsibleTable: FC<CollapsibleTableProps> = ({
  columns,
  data,
  renderRowDetails,
  expandColumn = "Description",
}) => {
  const [openRows, setOpenRows] = useState<{ [key: number]: boolean }>({});

  const toggleRow = (index: number) => {
    setOpenRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const renderCellContent = (column: string, value: any, row: any) => {
    if (column === "Max weight") {
      return (
        <div className="flex gap-1 items-center">
          {value}
          <span className="text-outline text-label-small">kg</span>
        </div>
      );
    } else if (column === "Fee") {
      return (
        <div className="flex gap-2 items-center text-nowrap">
          <span>${value}</span>
          <span className="text-outline text-label-small">
            {row.Services === "Documents" ? "Per Box" : "Per Kilo"}
          </span>
        </div>
      );
    }
    return value;
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((row, index) => (
            <React.Fragment key={index}>
              <TableRow>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    {column === expandColumn ? (
                      <div className="flex justify-between items-center">
                        <span></span>
                        <IconButton
                          color="standard"
                          onClick={() => toggleRow(index)}
                        >
                          <Icon
                            name={
                              openRows[index] ? "caret up md" : "caret down md"
                            }
                            className="text-[20px]"
                          />
                        </IconButton>
                      </div>
                    ) : (
                      renderCellContent(column, row[column], row)
                    )}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell
                  style={{ paddingBottom: 0, paddingTop: 0 }}
                  colSpan={columns.length}
                >
                  <Collapse in={openRows[index]} timeout="auto" unmountOnExit>
                    <Box margin={2}>{renderRowDetails(row)}</Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
