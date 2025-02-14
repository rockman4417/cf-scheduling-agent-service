import React from "react";
import styled from "@emotion/styled";
import { Typography, Popover, Button } from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

type SalesRepProps = {
  rep: SalesRep;
  onRecommendRep: (r: SalesRep) => void;
};

export default function SalesRep({ rep, onRecommendRep }: SalesRepProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover-rep" : undefined;
  return (
    <div>
      <Wrapper onClick={(e) => handleClick(e)}>
        <Typography style={{ color: "#000" }}>{rep.name}</Typography>
        <Typography style={{ color: "#000" }}>Grade: {rep.grade}</Typography>
      </Wrapper>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Button onClick={() => onRecommendRep(rep)}>
          <Typography>Recommend Schedule</Typography>
          <AutoAwesomeIcon />
        </Button>
      </Popover>
    </div>
  );
}

const Wrapper = styled.button`
  background-color: #fff;
  boder-radius: 4px;
  border: 1px solid lightgrey;
  cursor: pointer;
  width: 220px;
`;
