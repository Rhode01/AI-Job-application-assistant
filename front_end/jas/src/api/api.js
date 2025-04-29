const api ={
    endpoints:{
        HOMEURL :`${import.meta.env.VITE_BASE_URL}`,
        CVUPLOAD:`${import.meta.env.VITE_BASE_URL}/upload_cv`,
        GET_USER:`${import.meta.env.VITE_BASE_URL}/users/me`,
        USERS:`${import.meta.env.VITE_BASE_URL}/users/`,
        CALLBACK_URL: `${import.meta.env.VITE_CALLBACK_URL}`

    }
}
export default api