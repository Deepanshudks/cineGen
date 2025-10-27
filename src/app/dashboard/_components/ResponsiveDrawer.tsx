"use client";

import { Menu } from "@mui/icons-material";
import { Drawer, IconButton, useMediaQuery } from "@mui/material";
import { useState } from "react";

export default function ResponsiveDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [open, setOpen] = useState(false);

  return (
    <>
      {isMobile && (
        <IconButton onClick={() => setOpen(true)}>
          <Menu />
        </IconButton>
      )}

      {isMobile && (
        <Drawer
          anchor="left"
          open={open}
          onClose={() => setOpen(false)}
          sx={{
            [`& .MuiDrawer-paper`]: {
              boxSizing: "border-box",
            },
          }}
        >
          {children}
        </Drawer>
      )}

      {!isMobile && (
        <Drawer
          className="!-z-0"
          variant="permanent"
          sx={{
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              boxSizing: "border-box",
              height: "calc(100% - 64px)",
              marginTop: "62px",
            },
          }}
        >
          {children}
        </Drawer>
      )}
    </>
  );
}
