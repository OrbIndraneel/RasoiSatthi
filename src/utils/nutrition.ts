interface Nutrients {
  calories: number;
  protein: number;
  fat: number;
}

const NUTRITION_DATABASE: Record<string, Nutrients> = {
  paneer: { calories: 265, protein: 18.3, fat: 20.8 },
  tofu: { calories: 76, protein: 8, fat: 4.8 },
  chicken: { calories: 165, protein: 31, fat: 3.6 },
  mutton: { calories: 294, protein: 25, fat: 21 },
  fish: { calories: 120, protein: 20, fat: 4 },
  shrimp: { calories: 99, protein: 24, fat: 0.3 },
  prawns: { calories: 99, protein: 24, fat: 0.3 },
  egg: { calories: 155, protein: 13, fat: 11 },
  potato: { calories: 77, protein: 2, fat: 0.1 },
  potatoes: { calories: 77, protein: 2, fat: 0.1 },
  aloo: { calories: 77, protein: 2, fat: 0.1 },
  onion: { calories: 40, protein: 1.1, fat: 0.1 },
  onions: { calories: 40, protein: 1.1, fat: 0.1 },
  tomato: { calories: 18, protein: 0.9, fat: 0.2 },
  tomatoes: { calories: 18, protein: 0.9, fat: 0.2 },
  rice: { calories: 350, protein: 7, fat: 0.6 },
  flour: { calories: 340, protein: 12, fat: 2 },
  atta: { calories: 340, protein: 12, fat: 2 },
  maida: { calories: 340, protein: 10, fat: 1 },
  besan: { calories: 387, protein: 22, fat: 7 },
  suji: { calories: 360, protein: 12, fat: 1 },
  semolina: { calories: 360, protein: 12, fat: 1 },
  dal: { calories: 340, protein: 24, fat: 1 },
  lentil: { calories: 340, protein: 24, fat: 1 },
  lentils: { calories: 340, protein: 24, fat: 1 },
  chana: { calories: 360, protein: 20, fat: 6 },
  rajma: { calories: 333, protein: 24, fat: 0.8 },
  oil: { calories: 884, protein: 0, fat: 100 },
  butter: { calories: 717, protein: 0.9, fat: 81 },
  ghee: { calories: 900, protein: 0, fat: 100 },
  milk: { calories: 60, protein: 3.2, fat: 3.25 },
  cream: { calories: 340, protein: 2, fat: 35 },
  yogurt: { calories: 61, protein: 3.5, fat: 3.25 },
  curd: { calories: 61, protein: 3.5, fat: 3.25 },
  dahi: { calories: 61, protein: 3.5, fat: 3.25 },
  spinach: { calories: 23, protein: 2.9, fat: 0.4 },
  palak: { calories: 23, protein: 2.9, fat: 0.4 },
  cauliflower: { calories: 25, protein: 1.9, fat: 0.3 },
  gobhi: { calories: 25, protein: 1.9, fat: 0.3 },
  pea: { calories: 81, protein: 5.4, fat: 0.4 },
  peas: { calories: 81, protein: 5.4, fat: 0.4 },
  matar: { calories: 81, protein: 5.4, fat: 0.4 },
  carrot: { calories: 41, protein: 0.9, fat: 0.2 },
  gajar: { calories: 41, protein: 0.9, fat: 0.2 },
  garlic: { calories: 149, protein: 6.4, fat: 0.5 },
  ginger: { calories: 80, protein: 1.8, fat: 0.8 },
  chilli: { calories: 40, protein: 2, fat: 0.4 },
  chili: { calories: 40, protein: 2, fat: 0.4 },
  coriander: { calories: 23, protein: 2, fat: 0.5 },
  lemon: { calories: 29, protein: 1.1, fat: 0.3 },
  sugar: { calories: 387, protein: 0, fat: 0 },
  salt: { calories: 0, protein: 0, fat: 0 },
  water: { calories: 0, protein: 0, fat: 0 },
};

// Helper to parse float from strings like "1/2", "1.5", "1-2"
function parseFloatRange(str: string): number {
  const cleanStr = str.replace(/[^0-9/.-]/g, "").trim();
  if (cleanStr.includes("/")) {
    const parts = cleanStr.split("/");
    if (parts.length === 2) {
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      if (!isNaN(num) && !isNaN(den) && den !== 0) {
        return num / den;
      }
    }
  }
  if (cleanStr.includes("-")) {
    const parts = cleanStr.split("-");
    const val1 = parseFloat(parts[0]);
    const val2 = parseFloat(parts[1]);
    if (!isNaN(val1) && !isNaN(val2)) {
      return (val1 + val2) / 2;
    }
  }
  const matched = str.match(/[0-9.]+/);
  if (matched) {
    return parseFloat(matched[0]);
  }
  return NaN;
}

export function estimateRecipeNutrition(ingredients: any[] | undefined | null): Nutrients {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalFat = 0;

  if (!ingredients || !Array.isArray(ingredients)) {
    return {
      calories: 320,
      protein: 12.5,
      fat: 9.8
    };
  }

  for (const ing of ingredients) {
    if (!ing || typeof ing.name !== 'string') {
      continue;
    }
    const nameLower = ing.name.toLowerCase();
    const amountLower = (ing.amount || '').toLowerCase();

    // Check if ingredient name maps to any in our database
    let databaseKey = "";
    for (const key of Object.keys(NUTRITION_DATABASE)) {
      if (nameLower.includes(key)) {
        databaseKey = key;
        break;
      }
    }

    if (!databaseKey) {
      continue;
    }

    const itemProps = NUTRITION_DATABASE[databaseKey];

    // Parse amount
    let quantity = parseFloatRange(amountLower);
    if (isNaN(quantity) || quantity <= 0) {
      if (amountLower.includes("taste") || amountLower.includes("garnish") || amountLower.includes("few") || amountLower.includes("pinch")) {
        quantity = 0.1;
      } else {
        quantity = 1;
      }
    }

    // Determine weight in grams
    let weightInGrams = 50;

    if (amountLower.includes("kg")) {
      weightInGrams = quantity * 1000;
    } else if (amountLower.includes("g") && !amountLower.includes("ginger") && !amountLower.includes("garlic")) {
      weightInGrams = quantity;
    } else if (amountLower.includes("ml")) {
      weightInGrams = quantity;
    } else if (amountLower.includes("cup")) {
      if (["rice", "flour", "atta", "maida", "besan", "suji", "semolina"].includes(databaseKey)) {
        weightInGrams = quantity * 150;
      } else if (["dal", "lentil", "lentils", "chana", "rajma"].includes(databaseKey)) {
        weightInGrams = quantity * 180;
      } else if (["milk", "curd", "yogurt", "dahi", "cream"].includes(databaseKey)) {
        weightInGrams = quantity * 240;
      } else if (["oil", "butter", "ghee"].includes(databaseKey)) {
        weightInGrams = quantity * 200;
      } else {
        weightInGrams = quantity * 100;
      }
    } else if (amountLower.includes("tbsp") || amountLower.includes("tablespoon")) {
      weightInGrams = quantity * 15;
    } else if (amountLower.includes("tsp") || amountLower.includes("teaspoon")) {
      weightInGrams = quantity * 5;
    } else if (amountLower.includes("pinch")) {
      weightInGrams = quantity * 1;
    } else {
      if (databaseKey === "paneer") {
        weightInGrams = quantity * 200;
      } else if (["potato", "potatoes", "aloo"].includes(databaseKey)) {
        weightInGrams = quantity * 150;
      } else if (["onion", "onions"].includes(databaseKey)) {
        weightInGrams = quantity * 100;
      } else if (["tomato", "tomatoes"].includes(databaseKey)) {
        weightInGrams = quantity * 100;
      } else if (["egg", "eggs"].includes(databaseKey)) {
        weightInGrams = quantity * 50;
      } else if (["carrot", "gajar"].includes(databaseKey)) {
        weightInGrams = quantity * 75;
      } else if (["chilli", "chili"].includes(databaseKey)) {
        weightInGrams = quantity * 5;
      } else {
        weightInGrams = quantity * 50;
      }
    }

    totalCalories += (weightInGrams * itemProps.calories) / 100;
    totalProtein += (weightInGrams * itemProps.protein) / 100;
    totalFat += (weightInGrams * itemProps.fat) / 100;
  }

  // Ensure minimum default bounds for typical recipe dishes
  if (totalCalories < 100 && ingredients.length > 3) {
    totalCalories = 250;
    totalProtein = 8;
    totalFat = 6;
  }

  // Final absolute guards for any cases
  if (isNaN(totalCalories) || totalCalories <= 0) totalCalories = 320;
  if (isNaN(totalProtein) || totalProtein < 0) totalProtein = 12.5;
  if (isNaN(totalFat) || totalFat < 0) totalFat = 9.8;

  return {
    calories: Math.round(totalCalories),
    protein: Math.round(totalProtein * 10) / 10,
    fat: Math.round(totalFat * 10) / 10,
  };
}
