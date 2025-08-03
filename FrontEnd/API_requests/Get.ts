import { getCurrentLocation } from './Location';

async function getToday(){
    const response = await fetch('https://complete-seagull-pet.ngrok-free.app/api/v1/get_today', {
        method: 'GET',
    }).then(res => res.json());

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
}

async function netChange(){
    const myHeaders = new Headers();
    const location = await getCurrentLocation();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "longitude": location.longitude,
        "latitude": location.latitude
    });

    const response = await fetch("https://complete-seagull-pet.ngrok-free.app/api/v1/net_change", {
        method: "GET",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    })
        .then((res) => {
            return res.json();
        })
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
}

async function getDiseaseOutbreaks() {
    const myHeaders = new Headers();
    const location = await getCurrentLocation();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "longitude": location.longitude,
        "latitude": location.latitude
    });

    const response = await fetch("https://complete-seagull-pet.ngrok-free.app/api/v1/find_disease", {
        method: "GET",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    })
        .then((res) => {
            return res.json();
        })

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
}

async function getNearby() {
    const myHeaders = new Headers();
    const location = await getCurrentLocation();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "longitude": location.longitude,
        "latitude": location.latitude
    });

    const response = await fetch("https://complete-seagull-pet.ngrok-free.app/api/v1/get_nearby", {
        method: "GET",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    })
        .then((res) => {
            return res.json();
        })

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
}

export { getToday, netChange, getDiseaseOutbreaks, getNearby};