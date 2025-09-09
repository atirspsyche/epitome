import React from "react";

function Work({ pageContext }) {
  const { brand } = pageContext;
  return <div>{brand}</div>;
}

export default Work;
