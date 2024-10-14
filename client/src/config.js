import axios from "axios";

const getmoodurl=async()=>{
    let moodurl='';

try {
    const res=await axios.get('/lmspath');
    moodurl=res.data.url;
    localStorage.setItem('lmsurl',moodurl);
} catch (error) {
    
}
}
getmoodurl();


export const envc = {
    Moodle_url: localStorage.getItem('lmsurl'),
    API_URL: '/api'
};