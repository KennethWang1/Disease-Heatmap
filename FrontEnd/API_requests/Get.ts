import { getCurrentLocation } from "./Location";

// Number of reports made today
async function getToday() {
  const res = await fetch(
    "localhost:3000/api/v1/get_today"
    // "https://complete-seagull-pet.ngrok-free.app/api/v1/get_today"
  );

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const data = await res.json();
  return data;
}

// Number between 1 and -1, percent change from this week and last week
async function netChange() {
  const myHeaders = new Headers();
  const location = await getCurrentLocation();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    longitude: location.longitude,
    latitude: location.latitude,
  });

  const response = await fetch(
    // https://complete-seagull-pet.ngrok-free.app/api/v1/net_change
    "localhost:3000/api/v1/net_change",
    {
      method: "GET",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    }
  ).then((res) => {
    return res.json();
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}

// Disease type
async function getDiseaseOutbreaks() {
  const myHeaders = new Headers();
  const location = await getCurrentLocation();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    longitude: location.longitude,
    latitude: location.latitude,
  });

  const response = await fetch(
    "https://complete-seagull-pet.ngrok-free.app/api/v1/find_disease",
    {
      method: "GET",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    }
  ).then((res) => {
    return res.json();
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}

/*
// Gets points near you above severity 2
async function getNearby() {
  const myHeaders = new Headers();
  const location = await getCurrentLocation();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    longitude: location.longitude,
    latitude: location.latitude,
  });

  const response = await fetch(
    "https://complete-seagull-pet.ngrok-free.app/api/v1/get_nearby",
    {
      method: "GET",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    }
  ).then((res) => {
    return res.json();
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}

*/

async function getNearby() {
  try {
    const location = await getCurrentLocation();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      longitude: location.longitude,
      latitude: location.latitude,
    });

    const response = await fetch(
      "https://complete-seagull-pet.ngrok-free.app/api/v1/get_nearby",
      {
        method: "POST", // Changed from GET to POST since you're sending a body
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      }
    );

    // Check response.ok BEFORE calling .json()
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching nearby data:", error);
    throw error;
  }
}
export { getToday, netChange, getDiseaseOutbreaks, getNearby };
