import React from "react";

import Container from "@mui/material/Container";

const DashboardPagesLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <Container className="!grow !pt-16 md:!pt-24">{children}</Container>;
};

export default DashboardPagesLayout;
