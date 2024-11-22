import * as React from "react";

const SheetBgIcon = ({ selectedColor }) => (
  <svg
    width={25}
    height={50}
    viewBox="0 0 25 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x={1}
      y={1}
      width={23}
      height={48}
      rx={5}
      fill="#D9D9D9"
      stroke="black"
      strokeWidth={2}
    />
    <path
      d="M2 22C2 20.3431 3.34315 19 5 19H20C21.6569 19 23 20.3431 23 22V44C23 46.2091 21.2091 48 19 48H6C3.79086 48 2 46.2091 2 44V22Z"
      fill={selectedColor ? selectedColor : "white"}
    />
  </svg>
);

export default SheetBgIcon;
