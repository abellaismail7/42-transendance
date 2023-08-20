"use client";

import * as React from "react";

export const Button = () => {
  return (
    <button className="text-red-700" onClick={() => alert("boop")}>
      Boop
    </button>
  );
};
