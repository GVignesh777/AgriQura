const DiseaseDetection = require('../database/models/DiseaseDetection');
const Farmer = require('../database/models/Farmer');
const { getGroqCompletion } = require('../services/groqClient');

exports.analyzeDiseaseImage = async (req, res, next) => {
  try {
    const { imageUrl, description, language } = req.body;
    const farmer = await Farmer.findOne({ user: req.user.id });

    if (!imageUrl && !description) {
      return res.status(400).json({ success: false, error: 'Image URL or symptom description is required' });
    }

    const targetLanguage = language || 'English';

    const prompt = `
Analyze the provided image and report submitted by a farmer:
Symptom Description: ${description || 'Visual spots / wilting on leaves'}

Task Requirements:
1. CHECK IMAGE VALIDITY: Determine if the image actually shows an agriculture-related crop, plant, leaf, pest, or agricultural disease. If it is a person, car, building, random object, unrelated photograph, or non-agricultural scene, you MUST set "detectedDisease" to "Not an agriculture crop", set "cropName" to "None", and skip all other analysis.
2. CHECK IMAGE CLARITY: If the image is agricultural but blurry, too dark, distant, very low resolution, heavily obstructed, or the symptoms are simply not visible enough to make a safe diagnosis, you MUST set "detectedDisease" to "Unclear image", set "confidenceScore" to 0, and instruct the user in the "recommendedActions" to upload a clearer image. Do NOT guess.
3. IDENTIFY CROP: If the image is valid and clear, identify the specific crop name.
4. DIAGNOSE BASED ON EVIDENCE: Carefully evaluate the visible evidence (plant part, symptoms, pest damage, discoloration, wilting). Do NOT guess. If there are visible signs of disease/pest, identify it. If it looks perfectly healthy, set "detectedDisease" to "Healthy Crop". If you are uncertain despite the image being clear, state that you cannot confidently identify the disease.
5. CONFIDENCE SCORING: Calculate confidence strictly based on visual evidence. If the diagnosis is highly certain from the symptoms, score 85-99. If it's a weak match, score lower. If it is an invalid or unclear image, score 0.
6. TARGETED TREATMENT: Only generate chemical and organic treatments if a specific disease or deficiency is confidently identified. If the crop is healthy or the image is unclear/invalid, leave treatment arrays empty.

Respond ENTIRELY in a valid JSON object with the following keys EXACTLY:
{
  "cropName": "string (identified crop name, or 'None')",
  "detectedDisease": "string (name of disease, 'Healthy Crop', 'Not an agriculture crop', or 'Unclear image')",
  "confidenceScore": number (0-100),
  "symptoms": ["array", "of", "strings", "describing", "visible", "evidence"],
  "causes": ["array", "of", "strings"],
  "recommendedActions": ["array", "of", "strings"],
  "preventionSteps": ["array", "of", "strings"],
  "chemicalTreatment": ["array", "of", "strings"],
  "organicTreatment": ["array", "of", "strings"]
}

CRITICAL: Translate all the string VALUES in the JSON (but keep the JSON keys exactly as listed above in English) into the following language: ${targetLanguage}.
Ensure the output is strictly valid JSON, with NO markdown wrapping, NO backticks, and NO extra text outside the JSON block.
`;

    let aiResultText;
    try {
      aiResultText = await getGroqCompletion({
        prompt,
        imageUrl,
        farmerContext: { farmerName: req.user.name, language: targetLanguage },
        useStrongModel: true,
        isVision: !!imageUrl,
      });
    } catch (e) {
      aiResultText = null;
    }

    let resultData;
    if (aiResultText) {
      try {
        const jsonStr = aiResultText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonStr);
        resultData = {
          farmer: farmer?._id || req.user.id,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?w=800',
          cropName: parsed.cropName || 'Unknown Crop',
          detectedDisease: parsed.detectedDisease || 'Unknown',
          confidenceScore: parsed.confidenceScore || 85,
          symptoms: parsed.symptoms || [],
          causes: parsed.causes || [],
          recommendedActions: parsed.recommendedActions || [],
          preventionSteps: parsed.preventionSteps || [],
          chemicalTreatment: parsed.chemicalTreatment || [],
          organicTreatment: parsed.organicTreatment || [],
          disclaimer: 'AI-assisted screening only — not a certified laboratory diagnosis.',
        };
      } catch (parseError) {
        console.error('Failed to parse Groq JSON response:', parseError);
      }
    }

    if (!resultData) {
      return res.status(500).json({ success: false, error: 'No data. AI failed to analyze the image or returned an invalid response.' });
    }

    if (resultData.detectedDisease.toLowerCase().includes('not an agriculture crop') || resultData.cropName === 'None') {
      return res.status(400).json({ success: false, error: 'Please upload a correct image of a plant, crop, leaf, fruit, stem, pest, or visible agricultural disease symptom.' });
    }

    if (resultData.detectedDisease.toLowerCase().includes('unclear image') || resultData.confidenceScore === 0) {
      return res.status(400).json({ success: false, error: 'Unable to confidently identify the disease from this image. Please upload a clearer image showing the affected part of the plant.' });
    }

    const record = await DiseaseDetection.create(resultData);

    res.status(201).json({
      success: true,
      message: 'Disease screening complete',
      analysis: record,
    });
  } catch (error) {
    next(error);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const farmer = await Farmer.findOne({ user: req.user.id });
    if (!farmer) return res.status(200).json({ success: true, history: [] });

    const history = await DiseaseDetection.find({ farmer: farmer._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: history.length, history });
  } catch (error) {
    next(error);
  }
};
