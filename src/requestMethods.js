import axios from "axios";

const BASE_URL = "https://ecommerce-api-kh01.onrender.com/api/v1/";

let token;
try {
    token = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken
} catch(error) {
    token ="";
}

export const publicRequest = axios.create({
    baseURL: BASE_URL,    
});

export const userRequest = axios.create({
    baseURL: BASE_URL,  
    headers: {token:`Bearer ${token}`}
})