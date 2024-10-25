import Header from "../components/Header";
import React from "react";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";

function Home() {

    const token = localStorage.getItem(ACCESS_TOKEN);
    let decodedToken = null;
    
    if (token) {
        decodedToken = jwtDecode(token);
    }

    return(
    <>  
        <Header />
        <div>home</div>
        {console.log(decodedToken)}
    </>
    );
}

export default Home
