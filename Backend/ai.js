const {GoogleGenAI} = require('@google/genai');

async function findDiseaseOutbreak(data) {
  for (let i = 1; i <= 5; i++) {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });
    const tools = [
    {
      googleSearch: {
      }
    },
    ];
    const config = {
      temperature: 0.25,
      thinkingConfig: {
        thinkingBudget: 0,
      },
      mediaResolution: 'MEDIA_RESOLUTION_MEDIUM',
      tools,
    };
      const model = 'gemini-2.5-flash';
      const contents = [
        {
          role: 'user',
          parts: [
            {
            text: `You are a meticulous Epidemiological Data Analyst.

      Your objective is to analyze the provided dataset of patient-reported symptoms to determine if a specific disease is undergoing an outbreak in the population. You must follow the analysis procedure and definitions provided below.

      **1. Disease Profiles**
      Use this knowledge base to classify patients. A patient is considered a potential case for a disease if they exhibit **at least two** of its primary symptoms.

      * **Influenza:**
          * Primary Symptoms: 'fever', 'cough', 'headache'
      * **Common Cold:**
          * Primary Symptoms: 'runny nose', 'sneezing', 'sore throat'
      * **Gastroenteritis:**
          * Primary Symptoms: 'nausea', 'dizziness'

      **2. Analysis Procedure**
      Follow these steps in order:

      * **Step 1: Filter Data:** Discard all records with a 'trust' value less than or equal to 0.5. All subsequent calculations will be based on this filtered, high-trust dataset.
      * **Step 2: Classify Patients:** For each record in the filtered dataset, determine if it matches the profile for Influenza, Common Cold, or Gastroenteritis based on the definitions in Section 1.
      * **Step 3: Identify an Outbreak:** An **outbreak** is officially occurring if **more than 25%** of the filtered patient records match a single disease profile.
      * **Step 4: Determine Final Result:**
          * If one or more diseases meet the outbreak threshold, identify the one with the highest percentage of cases.
          * If no disease meets the 25% threshold, the result is 'No Outbreak'.

      **3. Output Format**
      Your response must be a single JSON object and nothing else. Do not include any explanatory text before or after the JSON.

      The JSON object must have the following structure:
      '''json
      {
      "identified_disease": "Name of the disease with the highest percentage, or 'No Outbreak'. Use proper capitalization.",
      "score": "The percentage of the filtered population matching the identified disease, formatted as a decimal between 0.0 and 1.0. If 'No Outbreak', this should be the percentage of the most prevalent disease.",
      "analysis_summary": {
        "total_records": "The initial count of all records.",
        "high_trust_records": "The count of records after filtering for trust > 0.5.",
        "influenza_cases": "The count of records matching the Influenza profile.",
        "common_cold_cases": "The count of records matching the Common Cold profile.",
        "gastroenteritis_cases": "The count of records matching the Gastroenteritis profile."
      }
      }

      The dataset to analysis is as follows:

          ${JSON.stringify(data)}
      `,
          },
        ],
        },
      ];

      const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
      });
      
      let fullResponse = '';
      for await (const chunk of response) {
        if (chunk.text) {
        fullResponse += chunk.text;
      }
    }
    try {
      fullResponse = JSON.parse(fullResponse);
      return fullResponse;
    } catch (error) {
      console.error(`Error parsing response (attempt ${i}): `, error);
    }  
  }

  throw new Error('Failed to parse response after 5 attempts');
}

module.exports = { findDiseaseOutbreak };