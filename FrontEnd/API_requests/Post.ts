import { getCurrentLocation } from "./Location";

async function findDiseaseOutbreak(
  uid: string,
  symptoms: any,
  wellnessScore: number,
  seriousness: number,
  trust: number
) {
  try {
    const userLocation = await getCurrentLocation();
    const jsonData = {
      uid: uid,
      location: {
        type: "Point",
        coordinates: [userLocation.longitude, userLocation.latitude],
      },
      date: new Date().toISOString(),
      gemini_info: {
        symptoms: symptoms, // assuming diseases is an array of symptoms
        wellness: wellnessScore,
        seriousness: seriousness,
        trust: trust,
      },
    };

    // Send data to your backend
    const response = await fetch("localhost:3000/api/v1/form_submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });

    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in findDiseaseOutbreak:", error);
    throw error;
  }
}

export { findDiseaseOutbreak };
