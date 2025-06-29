import React from "react";

export default function Square({ chooseSquare, val, className }) {
  
  return (
    <div className={className} onClick={chooseSquare}>
      {val}        
    </div>
  );
}
