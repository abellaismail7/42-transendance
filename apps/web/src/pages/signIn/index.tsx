import axios from "axios";
import { useState } from "react";
axios.defaults.withCredentials = true

function MyButtons() {
  async function loginWithPassword(){
    const response = await axios.post("http://localhost:4000/auth/login", {
      username: "tema@gmail.com",
      password: "1234",
    }).catch(console.error);
  }
    return (
      <>
        <a href="http://localhost:4000/auth/login-42">
          <button>I'm a button</button>
        </a>
        <button onClick={loginWithPassword}>login with password button</button>
      </>
    );
  }

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButtons />
    </div>
  );
}
