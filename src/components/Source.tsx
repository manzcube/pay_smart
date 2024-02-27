import React from "react";

import { TSource } from "../constants/interfaces";

const Source: React.FC<TSource> = ({ name, balance }) => {
  return (
    <div className="source">
      <h6>{name}</h6>
      <p>{(balance / 1).toFixed(2)}</p>
    </div>
  );
};

export default Source;
