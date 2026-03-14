require('dotenv').config();
const CategoryCache = require('../models/CategoryCache');

const categorizeExpense = async (title) => {
  try {
    // 1. Check if we already know the answer!
    const cleanTitle = title.toLowerCase().trim();
    const cachedItem = await CategoryCache.findOne({ title: cleanTitle });
    
    if (cachedItem) {
      console.log(`⚡ CACHE HIT: Found "${cleanTitle}" as ${cachedItem.category}`);
      return cachedItem.category;
    }

    console.log(`🐌 CACHE MISS: Asking AI for "${cleanTitle}"...`);

    // 2. If not in cache, ask Hugging Face
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli",
      {
        headers: { 
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json" 
        },
        method: "POST",
        body: JSON.stringify({
          inputs: title,
          parameters: {
           candidate_labels: [
  "Food & Dining",
  "Transportation",
  "Housing", // Now the AI will put electricity, water, and rent here!
  "Entertainment",
  "Shopping",
  "Healthcare",
  "Personal Care",
  "Miscellaneous"
],
          }
        }),
      }
    );

    const result = await response.json();

    if (result.error) {
        console.error("❌ Hugging Face Error:", result.error);
        return "Uncategorized";
    }

    let finalCategory = "Uncategorized";

    if (Array.isArray(result) && result.length > 0 && result[0].label) {
        finalCategory = result[0].label; 
    }

    // 3. Save the new answer to the cache for next time!
    if (finalCategory !== "Uncategorized") {
      try {
        await CategoryCache.create({ title: cleanTitle, category: finalCategory });
        console.log(`💾 SAVED TO CACHE: "${cleanTitle}" -> ${finalCategory}`);
      } catch (dbError) {
        // Ignore duplicate key errors if two requests happen at the exact same time
        console.log("Cache save skipped (already exists).");
      }
    }

    return finalCategory;

  } catch (error) {
    console.error("❌ AI Categorization Error:", error.message);
    return "Uncategorized"; 
  }
};

module.exports = { categorizeExpense };