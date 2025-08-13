"use client";
import React, { useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";

import { DEFAULT_CURRENCY } from "@/utils";

import { Icon } from "../Icon";

import { DescriptionCellProps, ExpandIconProps, TableProps } from "./types";

export const Table = ({
  columns,
  dataSource,
  className = "",
  expansionType = "",
}: TableProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleOpenModal = (row: any) => {
    if (isMobile || expansionType === "arrow") {
      setExpandedRow(expandedRow === row.key ? null : row.key);
    } else {
      setSelectedRow(row);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  const ExpandIcon = ({ isExpanded, onClick }: ExpandIconProps) => (
    <Icon
      name="caret down md"
      className={`text-[20px] pt-2 text-on-surface transition-transform duration-200 lg:px-16
                ${isExpanded ? "rotate-180" : "rotate-0"}`}
      onClick={onClick}
    />
  );

  const DescriptionCell = ({ row, isMobile, onOpen }: DescriptionCellProps) => {
    const isExpanded = expandedRow === row.key;
    if (!row.description) {
      return (
        <div className="text-on-surface-variant text-label-medium lg:py-12 lg:px-32">
          --
        </div>
      );
    }

    return isMobile || expansionType === "arrow" ? (
      <ExpandIcon isExpanded={isExpanded} onClick={() => onOpen(row)} />
    ) : (
      <Button
        variant="text-plain"
        className="!px-16 lg:!px-24"
        onClick={() => onOpen(row)}
      >
        Show
      </Button>
    );
  };

  const renderCellContent = (column: any, row: any) => {
    switch (column.dataIndex) {
      case "services":
        return (
          <div className="w-[62px] lg:w-[70px] text-start text-label-medium text-on-surface">
            {row[column.dataIndex]}
          </div>
        );
      case "max_weight":
        return (
          <div className="text-label-large text-on-surface max-w-[62px]">
            {row[column.dataIndex]}
            <span className="ml-2 text-label-small text-outline">kg</span>
          </div>
        );
      case "fee":
        return (
          <div className="text-label-large text-on-surface max-w-[82px]">
            {DEFAULT_CURRENCY.symbol}
            {row[column.dataIndex]}
            <span className="ml-2 text-label-small text-outline">
              {row.services === "Documents" ? "Per Box" : "Per Kilo"}
            </span>
          </div>
        );
      case "description":
        return (
          <DescriptionCell
            row={row}
            isMobile={isMobile}
            onOpen={handleOpenModal}
          />
        );
      default:
        return row[column.dataIndex];
    }
  };

  return (
    <>
      <div className={`${className}`}>
        <table className="overflow-hidden w-full border-separate border-spacing-0">
          <thead className="bg-surface-container-high h-[44px]">
            <tr className="border border-solid border-surface-container-high">
              {columns.map((column, index) => (
                <th
                  key={column.dataIndex}
                  className={`lg:px-12 whitespace-nowrap 
                                    first:pl-8 lg:first:pl-16 first:border-left-top first:rounded-tl-small
                                    last:pr-8 lg:last:pr-16 last:rounded-tr-small last:border-right-top
                                    ${
                                      index === 0
                                        ? "border border-solid border-surface-container-high"
                                        : "border-t border-solid border-surface-container-high"
                                    }`}
                  scope="col"
                >
                  <div
                    className={`text-label-medium text-on-surface ${index === columns.length - 1 ? "text-end" : "text-start"}`}
                  >
                    {column.title}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataSource.map((row, rowIndex) => (
              <React.Fragment key={row.key}>
                <tr
                  key={row.key}
                  className={`${
                    rowIndex === dataSource.length - 1 &&
                    expandedRow !== row.key
                      ? "last:border-right-bottom last:border-bottom"
                      : ""
                  }`}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={`${row.key}-${column.dataIndex}`}
                      scope="col"
                      className={`py-6 lg:py-8 first:pl-8 last:pr-8 lg:first:pl-16 lg:px-12 text-on-surface whitespace-nowrap 
                                        ${colIndex === columns.length - 1 ? "lg:!pr-0 lg:!pl-0 text-end" : ""}
                                        ${colIndex === 0 ? "border-b border-l border-surface-container-high" : ""}
                                        ${expandedRow === row.key ? "border-b-0" : ""}
                                        ${
                                          colIndex === columns.length - 1
                                            ? "border-b border-r border-surface-container-high"
                                            : "border-b border-surface-container-high"
                                        }
                                        ${
                                          rowIndex === dataSource.length - 1 &&
                                          colIndex === 0 &&
                                          expandedRow !== row.key
                                            ? "rounded-bl-small"
                                            : ""
                                        }
                                        ${
                                          rowIndex === dataSource.length - 1 &&
                                          colIndex === columns.length - 1 &&
                                          expandedRow !== row.key
                                            ? "rounded-br-small"
                                            : ""
                                        }`}
                    >
                      {renderCellContent(column, row)}
                    </td>
                  ))}
                </tr>
                {(isMobile || expansionType === "arrow") &&
                  expandedRow === row.key && (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className={`px-16 py-12 border-b border-l border-r border-surface-container-high whitespace-normal break-all
                                                ${rowIndex === dataSource.length - 1 ? "rounded-bl-small rounded-br-small" : ""}`}
                      >
                        <div className="text-body-medium text-on-surface">
                          {row.description}
                        </div>
                      </td>
                    </tr>
                  )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: "800px",
            maxWidth: "800px",
          },
        }}
      >
        <div className="p-24">
          <div className="flex justify-between">
            <div>
              <div className="text-on-surface text-title-medium">
                {selectedRow?.services}
              </div>
              <div className="text-on-surface-variant text-body-small">
                Description
              </div>
            </div>
            <IconButton
              color="outlined"
              className="!w-32 !h-32"
              onClick={handleCloseModal}
            >
              <Icon name="Close remove" className="text-[20px]" />
            </IconButton>
          </div>
          <p className="mt-16 max-w-full break-words text-on-surface-variant text-body-medium">
            {selectedRow?.description}
          </p>
        </div>
      </Dialog>
    </>
  );
};
