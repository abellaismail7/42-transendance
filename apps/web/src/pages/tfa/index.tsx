import axios from "axios";
import React, { useRef, useState } from "react";
axios.defaults.withCredentials = true

export default function TFA() {
  const value = useRef<HTMLInputElement>(null);
  console.log('value heere', value);
  async function handleSubmit() {
    try {
    const res = await axios.post("http://localhost:4000/auth/tfavalidation"
    , { code: value.current?.value, });
    console.log('res', res);
    } catch (err: any) {
      if (err.response) {
        console.log(err.response.data);
      }
      if (err.request) {
        console.log(err.request);
      }
      else {
        console.log(err);
      }
    }
  }
  return (
    <>
      <h1>Two Factor Authentication</h1>
      <input
        type="text"
        ref={value}
      />
      <br />
      <button onClick={handleSubmit}>submit</button>
    </>
  );
}