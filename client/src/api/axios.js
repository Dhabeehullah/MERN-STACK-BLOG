import axios from "axios";

export const BASE_URL = "https://mern-stack-blog-dq8h.onrender.com";

export default axios.create({
    baseURL: BASE_URL
});