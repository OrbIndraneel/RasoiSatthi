export type Language = 'hi' | 'en' | 'ta' | 'te' | 'mr' | 'bn' | 'gu';

export interface FamilyMember {
  id: string;
  name: string;
  role: 'adult' | 'child' | 'senior';
  conditions: string[]; // 'diabetic', 'allergy-nuts', 'no-onion-garlic', etc.
}

export interface FamilyProfile {
  phone: string;
  name: string;
  language: Language;
  members: FamilyMember[];
  dietaryPreferences: string[]; // 'vegetarian', 'vegan', 'eggetarian', 'none'
  allergies: string[];
}

export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiryDays: number;
  freshRating: number;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
}

export interface Recipe {
  id: string;
  title: Record<Language, string>;
  ingredients: RecipeIngredient[];
  instructions: Record<Language, string[]>;
  prepTime: number;
  tags: string[];
  imageUrl: string;
}

export interface SuggestionResponse {
  explanation: string;
  curatedRecipes: Recipe[];
  isFallback?: boolean;
  errorType?: string;
  errorMessage?: string;
}

export interface MandiItem {
  ingredient: string;
  basePrice: number;
  currentPrice: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  mandi: string;
}

export interface GroceryPlanResponse {
  mealsPlanned: Array<{ day: string; breakfast: string; lunch: string; dinner: string }>;
  groceryItems: Array<{ name: string; quantityNeeded: string; estimatedPrice: number; category: string; reason: string }>;
  costEfficiencyScore: number;
  mandiTip: string;
}
