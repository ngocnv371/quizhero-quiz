import { Avatar, Tooltip } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
} from "@mui/x-data-grid";
import { format, formatDistance } from "date-fns";

import React from "react";

const rows: GridRowsProp = [
  {
    id: 1,
    name: "quiz 1",
    statusId: 1,
    topicId: 2,
    createdById: 3,
    createdAt: "2020-03-31T00:00:00.000Z",
  },
  {
    id: 2,
    name: "quiz 2",
    statusId: 1,
    topicId: 2,
    createdById: 3,
    createdAt: "2020-03-31T00:00:00.000Z",
  },
  {
    id: 3,
    name: "quiz 3",
    statusId: 1,
    topicId: 2,
    createdById: 3,
    createdAt: "2020-03-31T00:00:00.000Z",
  },
];

const today = new Date();
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "name", headerName: "Name", flex: 1 },
  {
    field: "topicId",
    headerName: "Topic",
    align: "center",
    headerAlign: "center",
    width: 100,
  },
  {
    field: "statusId",
    headerName: "Status",
    align: "center",
    headerAlign: "center",
    width: 100,
  },
  {
    field: "createdById",
    headerName: "Creator",
    width: 100,
    align: "center",
    headerAlign: "center",
    renderCell: (params: GridRenderCellParams) => {
      return (
        <Avatar src={`https://i.pravatar.cc/300?${params.value}`}></Avatar>
      );
    },
  },
  {
    field: "createdAt",
    headerName: "Created",
    width: 200,
    headerAlign: "right",
    align: "right",
    renderCell: (params: GridRenderCellParams) => {
      const date = new Date(params.value);
      const distance = formatDistance(date, today);
      const text = format(date, "Pp");
      return (
        <Tooltip title={text} placement="top">
          <span>{distance}</span>
        </Tooltip>
      );
    },
  },
];

export default function QuizzesTable() {
  return (
    <div style={{ height: 300, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}
