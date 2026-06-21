var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "15mb" }));
var INDIAN_MANDI_PRICES = [
  { ingredient: "Tomato", basePrice: 28, currentPrice: 32, unit: "kg", trend: "up", mandi: "Azadpur Mandi, Delhi" },
  { ingredient: "Onion", basePrice: 35, currentPrice: 38, unit: "kg", trend: "up", mandi: "Lasalgaon Mandi, Nashik" },
  { ingredient: "Potato", basePrice: 20, currentPrice: 18, unit: "kg", trend: "down", mandi: "Agra Mandi, UP" },
  { ingredient: "Green Chillies", basePrice: 60, currentPrice: 65, unit: "kg", trend: "up", mandi: "Koyambedu Mandi, Chennai" },
  { ingredient: "Coriander Leaves", basePrice: 40, currentPrice: 45, unit: "kg", trend: "up", mandi: "Vashi Mandi, Mumbai" },
  { ingredient: "Ginger", basePrice: 120, currentPrice: 140, unit: "kg", trend: "up", mandi: "Vashi Mandi, Mumbai" },
  { ingredient: "Garlic", basePrice: 180, currentPrice: 165, unit: "kg", trend: "down", mandi: "Mandsaur Mandi, MP" },
  { ingredient: "Paneer (Cottage Cheese)", basePrice: 350, currentPrice: 360, unit: "kg", trend: "stable", mandi: "Dairy Union Market" },
  { ingredient: "Bhindi (Okra)", basePrice: 45, currentPrice: 40, unit: "kg", trend: "down", mandi: "Azadpur Mandi, Delhi" },
  { ingredient: "Gobi (Cauliflower)", basePrice: 30, currentPrice: 34, unit: "kg", trend: "up", mandi: "Agra Mandi, UP" },
  { ingredient: "Methi (Fenugreek Leaves)", basePrice: 50, currentPrice: 55, unit: "kg", trend: "up", mandi: "Vashi Mandi, Mumbai" },
  { ingredient: "Milk", basePrice: 64, currentPrice: 66, unit: "litre", trend: "stable", mandi: "Amul / Mother Dairy" }
];
var SEED_RECIPES = [
  {
    id: "r1",
    title: {
      hi: "\u092A\u0928\u0940\u0930 \u092D\u0941\u0930\u094D\u091C\u0940",
      en: "Paneer Bhurji",
      ta: "\u0BAA\u0BA9\u0BCD\u0BA9\u0BC0\u0BB0\u0BCD \u0BAA\u0BC1\u0BB0\u0BCD\u0B9C\u0BBF",
      te: "\u0C2A\u0C28\u0C4D\u0C28\u0C40\u0C30\u0C4D \u0C2D\u0C41\u0C30\u0C4D\u0C1C\u0C40",
      mr: "\u092A\u0928\u0940\u0930 \u092D\u0941\u0930\u094D\u091C\u0940",
      bn: "\u09AA\u09A8\u09BF\u09B0 \u09AD\u09C1\u09B0\u09CD\u099C\u09BF",
      gu: "\u0AAA\u0AA8\u0AC0\u0AB0 \u0AAD\u0AC1\u0AB0\u0A9C\u0AC0"
    },
    ingredients: [
      { name: "Paneer", amount: "200g" },
      { name: "Onion", amount: "1 medium (finely chopped)" },
      { name: "Tomato", amount: "1 medium (chopped)" },
      { name: "Green Chilli", amount: "2 (finely sliced)" },
      { name: "Ginger-Garlic Paste", amount: "1 tsp" },
      { name: "Turmeric Powder", amount: "1/4 tsp" },
      { name: "Kashmiri Lalchilli Powder", amount: "1/2 tsp" },
      { name: "Garam Masala", amount: "1/4 tsp" },
      { name: "Oil or Butter", amount: "1.5 tbsp" },
      { name: "Salt", amount: "to taste" },
      { name: "Coriander Leaves", amount: "for garnish" }
    ],
    instructions: {
      hi: [
        "\u090F\u0915 \u0915\u0921\u093C\u093E\u0939\u0940 \u092E\u0947\u0902 \u0924\u0947\u0932 \u092F\u093E \u092E\u0915\u094D\u0916\u0928 \u092E\u0927\u094D\u092F\u092E \u0906\u0902\u091A \u092A\u0930 \u0917\u0930\u094D\u092E \u0915\u0930\u0947\u0902\u0964",
        "\u091C\u0940\u0930\u093E \u0914\u0930 \u0905\u0926\u0930\u0915-\u0932\u0939\u0938\u0941\u0928 \u0915\u093E \u092A\u0947\u0938\u094D\u091F \u0921\u093E\u0932\u0915\u0930 \u0915\u091A\u094D\u091A\u093E \u0938\u094D\u0935\u093E\u0926 \u091C\u093E\u0928\u0947 \u0924\u0915 \u092D\u0942\u0928\u0947\u0902\u0964",
        "\u0915\u091F\u0947 \u0939\u0941\u090F \u092A\u094D\u092F\u093E\u091C \u0914\u0930 \u0939\u0930\u0940 \u092E\u093F\u0930\u094D\u091A \u091C\u094B\u0921\u093C\u0947\u0902, \u0914\u0930 \u092A\u094D\u092F\u093E\u091C \u0915\u0947 \u092A\u093E\u0930\u0926\u0930\u094D\u0936\u0940 \u0939\u094B\u0928\u0947 \u0924\u0915 \u092D\u0942\u0928\u0947\u0902\u0964",
        "\u0915\u091F\u0947 \u0939\u0941\u090F \u091F\u092E\u093E\u091F\u0930 \u0921\u093E\u0932\u0947\u0902 \u0914\u0930 \u0909\u0928\u0915\u0947 \u0928\u0930\u092E \u0939\u094B\u0928\u0947 \u0924\u0915 \u092A\u0915\u093E\u090F\u0902\u0964",
        "\u0939\u0932\u094D\u0926\u0940, \u0932\u093E\u0932 \u092E\u093F\u0930\u094D\u091A \u092A\u093E\u0909\u0921\u0930, \u0917\u0930\u092E \u092E\u0938\u093E\u0932\u093E \u0914\u0930 \u0928\u092E\u0915 \u0921\u093E\u0932\u0915\u0930 \u0905\u091A\u094D\u091B\u0940 \u0924\u0930\u0939 \u092E\u093F\u0932\u093E\u090F\u0902\u0964",
        "\u092E\u0938\u093E\u0932\u094B\u0902 \u0938\u0947 \u0924\u0947\u0932 \u0905\u0932\u0917 \u0939\u094B\u0928\u0947 \u092A\u0930 \u092E\u0938\u0932\u093E \u0939\u0941\u0906 (crumbled) \u092A\u0928\u0940\u0930 \u0921\u093E\u0932\u0947\u0902\u0964",
        "\u0927\u0940\u092E\u0940 \u0906\u0902\u091A \u092A\u0930 2 \u0938\u0947 3 \u092E\u093F\u0928\u091F \u0924\u0915 \u0905\u091A\u094D\u091B\u0940 \u0924\u0930\u0939 \u091A\u0932\u093E\u0924\u0947 \u0939\u0941\u090F \u092A\u0915\u093E\u090F\u0902\u0964",
        "\u0924\u093E\u091C\u093E \u0915\u091F\u0940 \u0939\u0941\u0908 \u0927\u0928\u093F\u092F\u093E \u092A\u0924\u094D\u0924\u0940 \u0938\u0947 \u0938\u091C\u093E\u0915\u0930 \u0917\u0930\u092E\u093E\u0917\u0930\u092E \u0930\u094B\u091F\u0940 \u092F\u093E \u092A\u0930\u093E\u0902\u0920\u0947 \u0915\u0947 \u0938\u093E\u0925 \u092A\u0930\u094B\u0938\u0947\u0902\u0964"
      ],
      en: [
        "Heat oil or butter in a pan over medium heat.",
        "Add cumin seeds and ginger-garlic paste; saut\xE9 until the raw aroma vanishes.",
        "Add chopped onions and green chillies, cooking until translucent.",
        "Mix in the chopped tomatoes and cook until they soften.",
        "Add turmeric powder, red chilli powder, garam masala, and salt. Mix well.",
        "Once oil separates from spices, add crumbled paneer.",
        "Cook on low heat for 2-3 minutes, stirring continuously to combine ingredients safely.",
        "Garnish with freshly chopped coriander leaves and serve hot with roti or paratha."
      ],
      ta: [
        "\u0B95\u0B9F\u0BBE\u0BAF\u0BBF\u0BB2\u0BCD \u0B8E\u0BA3\u0BCD\u0BA3\u0BC6\u0BAF\u0BCD \u0B85\u0BB2\u0BCD\u0BB2\u0BA4\u0BC1 \u0BB5\u0BC6\u0BA3\u0BCD\u0BA3\u0BC6\u0BAF\u0BCD \u0B9A\u0BC2\u0B9F\u0BBE\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD.",
        "\u0B9A\u0BC0\u0BB0\u0B95\u0BAE\u0BCD, \u0B87\u0B9E\u0BCD\u0B9A\u0BBF-\u0BAA\u0BC2\u0BA3\u0BCD\u0B9F\u0BC1 \u0BB5\u0BBF\u0BB4\u0BC1\u0BA4\u0BC1 \u0B9A\u0BC7\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BC1 \u0BAA\u0B9A\u0BCD\u0B9A\u0BC8 \u0BB5\u0BBE\u0B9A\u0BA9\u0BC8 \u0BAA\u0BCB\u0B95\u0BC1\u0BAE\u0BCD\u0BB5\u0BB0\u0BC8 \u0BB5\u0BA4\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD.",
        "\u0BA8\u0BB1\u0BC1\u0B95\u0BCD\u0B95\u0BBF\u0BAF \u0BB5\u0BC6\u0B99\u0BCD\u0B95\u0BBE\u0BAF\u0BAE\u0BCD, \u0BAA\u0B9A\u0BCD\u0B9A\u0BC8 \u0BAE\u0BBF\u0BB3\u0B95\u0BBE\u0BAF\u0BCD \u0B9A\u0BC7\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BC1 \u0BB5\u0BA4\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD.",
        "\u0BA4\u0B95\u0BCD\u0B95\u0BBE\u0BB3\u0BBF \u0B9A\u0BC7\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BC1 \u0B95\u0BC1\u0BB4\u0BC8\u0BB5\u0BBE\u0B95 \u0BB5\u0BA4\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD. \u0BAE\u0B9E\u0BCD\u0B9A\u0BB3\u0BCD, \u0BAE\u0BBF\u0BB3\u0B95\u0BBE\u0BAF\u0BCD \u0BA4\u0BC2\u0BB3\u0BCD, \u0B95\u0BB0\u0BAE\u0BCD \u0BAE\u0B9A\u0BBE\u0BB2\u0BBE, \u0B89\u0BAA\u0BCD\u0BAA\u0BC1 \u0B9A\u0BC7\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD.",
        "\u0B89\u0BA4\u0BBF\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4 \u0BAA\u0BA9\u0BCD\u0BA9\u0BC0\u0BB0\u0BCD \u0B9A\u0BC7\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BC1 \u0BAE\u0BBF\u0BA4\u0BAE\u0BBE\u0BA9 \u0BA4\u0BC0\u0BAF\u0BBF\u0BB2\u0BCD 2-3 \u0BA8\u0BBF\u0BAE\u0BBF\u0B9F\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B95\u0BBF\u0BB3\u0BB1\u0BBF \u0B87\u0BB1\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD. \u0B95\u0BCA\u0BA4\u0BCD\u0BA4\u0BAE\u0BB2\u0BCD\u0BB2\u0BBF \u0BA4\u0BC2\u0BB5\u0BBF \u0BAA\u0BB0\u0BBF\u0BAE\u0BBE\u0BB1\u0BB5\u0BC1\u0BAE\u0BCD."
      ],
      te: [
        "\u0C2C\u0C3E\u0C23\u0C32\u0C3F\u0C32\u0C4B \u0C28\u0C42\u0C28\u0C46 \u0C32\u0C47\u0C26\u0C3E \u0C35\u0C46\u0C28\u0C4D\u0C28 \u0C35\u0C47\u0C21\u0C3F \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F.",
        "\u0C1C\u0C40\u0C32\u0C15\u0C30\u0C4D\u0C30 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C05\u0C32\u0C4D\u0C32\u0C02-\u0C35\u0C46\u0C32\u0C4D\u0C32\u0C41\u0C32\u0C4D\u0C32\u0C3F \u0C2A\u0C47\u0C38\u0C4D\u0C1F\u0C4D \u0C35\u0C47\u0C38\u0C3F \u0C2A\u0C1A\u0C4D\u0C1A\u0C3F\u0C35\u0C3E\u0C38\u0C28 \u0C2A\u0C4B\u0C2F\u0C47\u0C35\u0C30\u0C15\u0C41 \u0C35\u0C47\u0C2F\u0C3F\u0C02\u0C1A\u0C3E\u0C32\u0C3F.",
        "\u0C09\u0C32\u0C4D\u0C32\u0C3F\u0C2A\u0C3E\u0C2F \u0C2E\u0C41\u0C15\u0C4D\u0C15\u0C32\u0C41, \u0C2A\u0C1A\u0C4D\u0C1A\u0C3F\u0C2E\u0C3F\u0C30\u0C4D\u0C1A\u0C3F \u0C35\u0C47\u0C38\u0C3F \u0C35\u0C47\u0C2F\u0C3F\u0C02\u0C1A\u0C3E\u0C32\u0C3F. \u0C24\u0C30\u0C3F\u0C17\u0C3F\u0C28 \u0C1F\u0C2E\u0C4B\u0C1F\u0C3E\u0C32\u0C41 \u0C35\u0C47\u0C38\u0C3F \u0C2E\u0C17\u0C4D\u0C17\u0C28\u0C3F\u0C35\u0C4D\u0C35\u0C3E\u0C32\u0C3F.",
        "\u0C2E\u0C38\u0C3E\u0C32\u0C3E\u0C32\u0C41, \u0C09\u0C2A\u0C4D\u0C2A\u0C41 \u0C35\u0C47\u0C38\u0C3F \u0C15\u0C32\u0C3F\u0C2A\u0C3F, \u0C1A\u0C3F\u0C26\u0C3F\u0C2E\u0C3F\u0C28 \u0C2A\u0C28\u0C4D\u0C28\u0C40\u0C30\u0C4D \u0C1C\u0C4B\u0C21\u0C3F\u0C02\u0C1A\u0C3E\u0C32\u0C3F. 2-3 \u0C28\u0C3F\u0C2E\u0C3F\u0C37\u0C3E\u0C32\u0C41 \u0C35\u0C47\u0C2F\u0C3F\u0C02\u0C1A\u0C3F \u0C15\u0C4A\u0C24\u0C4D\u0C24\u0C3F\u0C2E\u0C40\u0C30\u0C24\u0C4B \u0C38\u0C30\u0C4D\u0C35\u0C4D \u0C1A\u0C47\u0C2F\u0C3E\u0C32\u0C3F."
      ],
      mr: [
        "\u0915\u0922\u0908\u0924 \u0924\u0947\u0932 \u0915\u093F\u0902\u0935\u093E \u092C\u091F\u0930 \u0917\u0930\u092E \u0915\u0930\u093E.",
        "\u091C\u093F\u0930\u0947 \u0906\u0923\u093F \u0906\u0932\u0947-\u0932\u0938\u0942\u0923 \u092A\u0947\u0938\u094D\u091F \u0918\u093E\u0932\u0942\u0928 \u092A\u0930\u0924\u093E. \u092E\u0917 \u0915\u093E\u0902\u0926\u093E \u0906\u0923\u093F \u0939\u093F\u0930\u0935\u0940 \u092E\u093F\u0930\u091A\u0940 \u092E\u090A \u0939\u094B\u0908\u092A\u0930\u094D\u092F\u0902\u0924 \u092A\u0930\u0924\u093E.",
        "\u091F\u094B\u092E\u0945\u091F\u094B \u0918\u093E\u0932\u0942\u0928 \u092E\u090A \u0939\u094B\u0908\u092A\u0930\u094D\u092F\u0902\u0924 \u0936\u093F\u091C\u0935\u093E. \u0939\u0933\u0926, \u0924\u093F\u0916\u091F, \u0917\u0930\u092E \u092E\u0938\u093E\u0932\u093E \u0906\u0923\u093F \u092E\u0940\u0920 \u0918\u093E\u0932\u093E.",
        "\u091A\u0941\u0930\u093E \u0915\u0947\u0932\u0947\u0932\u093E \u092A\u0928\u0940\u0930 \u0918\u093E\u0932\u093E, \u0968-\u0969 \u092E\u093F\u0928\u093F\u091F\u0947 \u092E\u0902\u0926 \u0906\u091A\u0947\u0935\u0930 \u0939\u0932\u0935\u0942\u0928 \u0936\u093F\u091C\u0935\u093E, \u0915\u094B\u0925\u093F\u0902\u092C\u0940\u0930 \u0918\u093E\u0932\u0942\u0928 \u0917\u0930\u092E\u093E\u0917\u0930\u092E \u0938\u0930\u094D\u0935\u094D\u0939 \u0915\u0930\u093E."
      ],
      bn: [
        "\u0995\u09DC\u09BE\u0987\u09A4\u09C7 \u09A4\u09C7\u09B2 \u09AC\u09BE \u09AE\u09BE\u0996\u09A8 \u09AE\u09BE\u099D\u09BE\u09B0\u09BF \u0986\u0981\u099A\u09C7 \u0997\u09B0\u09AE \u0995\u09B0\u09C1\u09A8\u0964",
        "\u099C\u09BF\u09B0\u09C7 \u09AB\u09CB\u09DC\u09A8 \u09A6\u09BF\u09DF\u09C7 \u0986\u09A6\u09BE-\u09B0\u09B8\u09C1\u09A8 \u09AC\u09BE\u099F\u09BE \u0995\u09B7\u09BF\u09DF\u09C7 \u09A8\u09BF\u09A8\u0964 \u09AA\u09C7\u0981\u09DF\u09BE\u099C \u0993 \u0995\u09BE\u0981\u099A\u09BE\u09B2\u0999\u09CD\u0995\u09BE \u0995\u09C1\u099A\u09BF \u09B9\u09BE\u09B2\u0995\u09BE \u09B8\u09CB\u09A8\u09BE\u09B2\u09C0 \u0995\u09B0\u09C7 \u09AD\u09BE\u099C\u09C1\u09A8\u0964",
        "\u099F\u09AE\u09C7\u099F\u09CB \u0995\u09C1\u099A\u09BF \u09A6\u09BF\u09A8 \u0993 \u09A8\u09B0\u09AE \u09B9\u0993\u09DF\u09BE \u09AA\u09B0\u09CD\u09AF\u09A8\u09CD\u09A4 \u09B0\u09BE\u09A8\u09CD\u09A8\u09BE \u0995\u09B0\u09C1\u09A8\u0964 \u0997\u09C1\u0981\u09DC\u09CB \u09AE\u09B6\u09B2\u09BE \u0993 \u09A8\u09C1\u09A8 \u09AE\u09C7\u09B6\u09BE\u09A8\u0964",
        "\u09B9\u09BE\u09A4\u09C7 \u0997\u09C1\u0981\u09DC\u09CB \u0995\u09B0\u09C7 \u09B0\u09BE\u0996\u09BE \u09AA\u09A8\u09BF\u09B0 \u09AF\u09CB\u0997 \u0995\u09B0\u09C7 \u09E8-\u09E9 \u09AE\u09BF\u09A8\u09BF\u099F \u09A8\u09BE\u09DC\u09BE\u099A\u09BE\u09DC\u09BE \u0995\u09B0\u09C1\u09A8\u0964 \u09A7\u09A8\u09C7\u09AA\u09BE\u09A4\u09BE \u0995\u09C1\u099A\u09BF \u099B\u09DC\u09BF\u09DF\u09C7 \u0997\u09B0\u09AE \u09AA\u09B0\u09CB\u099F\u09BE\u09B0 \u09B8\u09BE\u09A5\u09C7 \u09AA\u09B0\u09BF\u09AC\u09C7\u09B6\u09A8 \u0995\u09B0\u09C1\u09A8\u0964"
      ],
      gu: [
        "\u0A8F\u0A95 \u0A95\u0AA1\u0ABE\u0A88\u0AAE\u0ABE\u0A82 \u0AA4\u0AC7\u0AB2 \u0A85\u0AA5\u0AB5\u0ABE \u0AAE\u0ABE\u0A96\u0AA3 \u0A97\u0AB0\u0AAE \u0A95\u0AB0\u0ACB. \u0A9C\u0AC0\u0AB0\u0AC1\u0A82 \u0A85\u0AA8\u0AC7 \u0A86\u0AA6\u0AC1-\u0AB2\u0AB8\u0AA3\u0AA8\u0AC0 \u0AAA\u0AC7\u0AB8\u0ACD\u0A9F \u0AB8\u0ABE\u0A82\u0AA4\u0AB3\u0ACB.",
        "\u0A9D\u0AC0\u0AA3\u0AC0 \u0AB8\u0AAE\u0ABE\u0AB0\u0AC7\u0AB2\u0AC0 \u0AA1\u0AC1\u0A82\u0A97\u0AB3\u0AC0 \u0A85\u0AA8\u0AC7 \u0AB2\u0AC0\u0AB2\u0ABE \u0AAE\u0AB0\u0A9A\u0ABE \u0A89\u0AAE\u0AC7\u0AB0\u0AC0\u0AA8\u0AC7 \u0AA1\u0AC1\u0A82\u0A97\u0AB3\u0AC0 \u0A97\u0AC1\u0AB2\u0ABE\u0AAC\u0AC0 \u0AA5\u0ABE\u0AAF \u0AA4\u0ACD\u0AAF\u0ABE\u0A82 \u0AB8\u0AC1\u0AA7\u0AC0 \u0AB8\u0ABE\u0A82\u0AA4\u0AB3\u0ACB.",
        "\u0A9F\u0ABE\u0AAE\u0AC7\u0A9F\u0ABE \u0A89\u0AAE\u0AC7\u0AB0\u0AC0\u0AA8\u0AC7 \u0AAE\u0ABF\u0A95\u0ACD\u0AB8 \u0A95\u0AB0\u0ACB, \u0AAC\u0AA7\u0ABE \u0AAE\u0AB8\u0ABE\u0AB2\u0ABE \u0A85\u0AA8\u0AC7 \u0AAE\u0AC0\u0AA0\u0AC1\u0A82 \u0A89\u0AAE\u0AC7\u0AB0\u0AC0 \u0AB8\u0ABE\u0A82\u0AA4\u0AB3\u0ACB, \u0AAE\u0AB8\u0AB3\u0AC7\u0AB2\u0ACB \u0AAA\u0AA8\u0AC0\u0AB0 \u0A89\u0AAE\u0AC7\u0AB0\u0AC0 \u0AE8-\u0AE9 \u0AAE\u0ABF\u0AA8\u0ABF\u0A9F \u0AA7\u0AC0\u0AAE\u0ABE \u0AA4\u0ABE\u0AAA\u0AC7 \u0AAA\u0ABE\u0A95\u0AB5\u0ABE \u0AA6\u0ACB."
      ]
    },
    prepTime: 15,
    tags: ["Vegetarian", "High Protein", "Quick Active", "North Indian"],
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "r2",
    title: {
      hi: "\u0924\u092E\u093F\u0932 \u0930\u0938\u092E",
      en: "Classic Tamil Rasam",
      ta: "\u0BA4\u0B95\u0BCD\u0B95\u0BBE\u0BB3\u0BBF \u0BAA\u0BC2\u0BA3\u0BCD\u0B9F\u0BC1 \u0BB0\u0B9A\u0BAE\u0BCD",
      te: "\u0C1F\u0C2E\u0C4B\u0C1F\u0C3E \u0C35\u0C46\u0C32\u0C4D\u0C32\u0C41\u0C32\u0C4D\u0C32\u0C3F \u0C30\u0C38\u0C02",
      mr: "\u0924\u093E\u092E\u093F\u0933 \u0930\u0938\u092E",
      bn: "\u09A4\u09BE\u09AE\u09BF\u09B2 \u09B0\u09B8\u09AE",
      gu: "\u0AA4\u0AAE\u0ABF\u0AB2 \u0AB0\u0AB8\u0AAE"
    },
    ingredients: [
      { name: "Tomato", amount: "2 medium (mashed)" },
      { name: "Tamarind extract", amount: "1 cup (thin)" },
      { name: "Garlic cloves", amount: "5-6 (crushed with oil)" },
      { name: "Black Pepper", amount: "1 tsp (crushed)" },
      { name: "Cumin Seeds", amount: "1 tsp" },
      { name: "Mustard Seeds", amount: "1/2 tsp" },
      { name: "Asafoetida (Hing)", amount: "a pinch" },
      { name: "Curry Leaves", amount: "1 sprig" },
      { name: "Oil or Ghee", amount: "2 tsp" },
      { name: "Coriander", amount: "handful" }
    ],
    instructions: {
      en: [
        "Crush cumin seeds, black pepper, and garlic roughly in a mortar pestle.",
        "In a bowl, mix tamarind paste with mashed tomatoes, salt, and water.",
        "Heat ghee or oil in a cooking pot, add mustard seeds, dry red chilli, curry leaves, and a pinch of hing.",
        "Add the crushed black pepper, cumin, and garlic. Fry for 30 seconds on low heat.",
        "Pour the tamarind-tomato mixture into the pan.",
        "Let the rasam heat up on low. As soon as you see bubbles forming around the edges (do not boil excessively), turn off the stove.",
        "Mix in chopped fresh coriander leaves immediately and cover the pot to seal the wonderful aroma."
      ],
      hi: [
        "\u0915\u093E\u0932\u0940 \u092E\u093F\u0930\u094D\u091A, \u091C\u0940\u0930\u093E \u0914\u0930 \u0932\u0939\u0938\u0941\u0928 \u0915\u094B \u0938\u093F\u0932\u092C\u091F\u094D\u091F\u0947 \u092F\u093E \u0913\u0916\u0932\u0940 \u092E\u0947\u0902 \u0926\u0930\u0926\u0930\u093E \u0915\u0942\u091F \u0932\u0947\u0902\u0964",
        "\u090F\u0915 \u092C\u0930\u094D\u0924\u0928 \u092E\u0947\u0902 \u0907\u092E\u0932\u0940 \u0915\u093E \u0930\u0938, \u092E\u0938\u0932\u0947 \u0939\u0941\u090F \u091F\u092E\u093E\u091F\u0930, \u0938\u094D\u0935\u093E\u0926\u093E\u0928\u0941\u0938\u093E\u0930 \u0928\u092E\u0915 \u0914\u0930 \u092A\u093E\u0928\u0940 \u092E\u093F\u0932\u093E\u090F\u0902\u0964",
        "\u0915\u0922\u093C\u093E\u0908 \u092E\u0947\u0902 \u0918\u0940 \u0917\u0930\u094D\u092E \u0915\u0930\u0947\u0902, \u092B\u093F\u0930 \u0930\u093E\u0908, \u0938\u0942\u0916\u0940 \u0932\u093E\u0932 \u092E\u093F\u0930\u094D\u091A, \u0915\u0922\u093C\u0940 \u092A\u0924\u094D\u0924\u093E \u0914\u0930 \u0939\u0940\u0902\u0917 \u0915\u093E \u0924\u0921\u093C\u0915\u093E \u0932\u0917\u093E\u090F\u0902\u0964",
        "\u0915\u0941\u091F\u093E \u0939\u0941\u0906 \u092E\u0938\u093E\u0932\u093E (\u0932\u0939\u0938\u0941\u0928, \u091C\u0940\u0930\u093E, \u0915\u093E\u0932\u0940 \u092E\u093F\u0930\u094D\u091A) \u0921\u093E\u0932\u0915\u0930 \u0927\u0940\u092E\u0940 \u0906\u0902\u091A \u092A\u0930 \u0969\u0966 \u0938\u0947\u0915\u0902\u0921 \u092D\u0942\u0928\u0947\u0902\u0964",
        "\u0905\u092C \u091F\u092E\u093E\u091F\u0930 \u0914\u0930 \u0907\u092E\u0932\u0940 \u0915\u093E \u0918\u094B\u0932 \u0915\u0922\u093C\u093E\u0908 \u092E\u0947\u0902 \u0921\u093E\u0932\u0947\u0902\u0964",
        "\u0907\u0938\u0947 \u0927\u0940\u092E\u0940 \u0906\u0902\u091A \u092A\u0930 \u0917\u0930\u094D\u092E \u0939\u094B\u0928\u0947 \u0926\u0947\u0902\u0964 \u0927\u094D\u092F\u093E\u0928 \u0930\u0939\u0947 \u0907\u0938\u0947 \u091C\u094D\u092F\u093E\u0926\u093E \u0916\u094C\u0932\u0928\u0947 \u0928\u0939\u0940\u0902 \u0926\u0947\u0928\u093E \u0939\u0948, \u091C\u0948\u0938\u0947 \u0939\u0940 \u0907\u0938\u092E\u0947\u0902 \u091D\u093E\u0917 \u092C\u0928\u0928\u0947 \u0932\u0917\u0947, \u0906\u0902\u091A \u092C\u0902\u0926 \u0915\u0930 \u0926\u0947\u0902\u0964",
        "\u090A\u092A\u0930 \u0938\u0947 \u0927\u0928\u093F\u092F\u093E \u092A\u0924\u094D\u0924\u093E \u091B\u093F\u0921\u093C\u0915\u0947\u0902 \u0914\u0930 \u0930\u0938\u0926\u093E\u0930 \u0930\u0938\u092E \u0915\u094B \u091A\u093E\u0935\u0932 \u0915\u0947 \u0938\u093E\u0925 \u092A\u0930\u094B\u0938\u0947\u0902\u0964"
      ],
      ta: [
        "\u0B9A\u0BC0\u0BB0\u0B95\u0BAE\u0BCD, \u0BAE\u0BBF\u0BB3\u0B95\u0BC1, \u0BAA\u0BC2\u0BA3\u0BCD\u0B9F\u0BC1 \u0B86\u0B95\u0BBF\u0BAF\u0BB5\u0BB1\u0BCD\u0BB1\u0BC8 \u0B87\u0B9F\u0BBF\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BCD \u0B95\u0BCA\u0BB3\u0BCD\u0BB3\u0BB5\u0BC1\u0BAE\u0BCD.",
        "\u0BAA\u0BC1\u0BB3\u0BBF\u0BA4\u0BCD \u0BA4\u0BA3\u0BCD\u0BA3\u0BC0\u0BB0\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BA4\u0B95\u0BCD\u0B95\u0BBE\u0BB3\u0BBF\u0BAF\u0BC8 \u0B92\u0BA9\u0BCD\u0BB1\u0BBE\u0B95 \u0B95\u0BB0\u0BC8\u0BA4\u0BCD\u0BA4\u0BC1 \u0B89\u0BAA\u0BCD\u0BAA\u0BC1 \u0B9A\u0BC7\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BC1 \u0BB5\u0BC8\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD.",
        "\u0BA4\u0BBE\u0BB3\u0BBF\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BBF\u0BAF \u0BAA\u0BCA\u0BB0\u0BC1\u0BB3\u0BCD\u0B95\u0BB3\u0BC8 \u0BA8\u0BC6\u0BAF\u0BCD\u0BAF\u0BBF\u0BB2\u0BCD \u0BA4\u0BBE\u0BB3\u0BBF\u0BA4\u0BCD\u0BA4\u0BC1, \u0B87\u0B9F\u0BBF\u0BA4\u0BCD\u0BA4 \u0BAE\u0B9A\u0BBE\u0BB2\u0BBE\u0BB5\u0BC8 \u0B9A\u0BC7\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BC1 \u0BB5\u0BA4\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD.",
        "\u0B95\u0BB0\u0BC8\u0BA4\u0BCD\u0BA4\u0BC1 \u0BB5\u0BC8\u0BA4\u0BCD\u0BA4 \u0B9A\u0BBE\u0BB1\u0BCD\u0BB1\u0BC8 \u0B8A\u0BB1\u0BCD\u0BB1\u0BBF, \u0BA8\u0BC1\u0BB0\u0BC8 \u0B95\u0BC2\u0B9F\u0BBF \u0BB5\u0BB0\u0BC1\u0BAE\u0BCD \u0BAA\u0BCB\u0BA4\u0BC1 \u0B85\u0B9F\u0BC1\u0BAA\u0BCD\u0BAA\u0BC8 \u0B85\u0BA3\u0BC8\u0BA4\u0BCD\u0BA4\u0BC1 \u0B95\u0BCA\u0BA4\u0BCD\u0BA4\u0BAE\u0BB2\u0BCD\u0BB2\u0BBF \u0BA4\u0BC2\u0BB5\u0BB5\u0BC1\u0BAE\u0BCD."
      ],
      te: [
        "\u0C2E\u0C3F\u0C30\u0C3F\u0C2F\u0C3E\u0C32\u0C41, \u0C1C\u0C40\u0C32\u0C15\u0C30\u0C4D\u0C30, \u0C35\u0C46\u0C32\u0C4D\u0C32\u0C41\u0C32\u0C4D\u0C32\u0C3F\u0C2A\u0C3E\u0C2F\u0C32\u0C28\u0C41 \u0C26\u0C02\u0C1A\u0C41\u0C15\u0C4B\u0C02\u0C21\u0C3F.",
        "\u0C1A\u0C3F\u0C02\u0C24\u0C2A\u0C02\u0C21\u0C41 \u0C30\u0C38\u0C02, \u0C1F\u0C2E\u0C4B\u0C1F\u0C3E\u0C32\u0C41 \u0C12\u0C15 \u0C17\u0C3F\u0C28\u0C4D\u0C28\u0C46\u0C32\u0C4B \u0C2C\u0C3E\u0C17\u0C3E \u0C15\u0C32\u0C3F\u0C2A\u0C3F \u0C09\u0C2A\u0C4D\u0C2A\u0C41 \u0C35\u0C47\u0C2F\u0C02\u0C21\u0C3F.",
        "\u0C24\u0C3E\u0C32\u0C3F\u0C02\u0C2A\u0C41 \u0C35\u0C47\u0C38\u0C3F \u0C26\u0C02\u0C1A\u0C3F\u0C28 \u0C2E\u0C38\u0C3E\u0C32\u0C3E \u0C35\u0C47\u0C2F\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F, \u0C1F\u0C2E\u0C4B\u0C1F\u0C3E \u0C1A\u0C3F\u0C02\u0C24\u0C2A\u0C02\u0C21\u0C41 \u0C2E\u0C3F\u0C36\u0C4D\u0C30\u0C2E\u0C02 \u0C2A\u0C4B\u0C38\u0C3F \u0C2E\u0C30\u0C3F\u0C17\u0C3F\u0C02\u0C1A\u0C3F \u0C28\u0C41\u0C30\u0C17 \u0C30\u0C3E\u0C17\u0C3E\u0C28\u0C47 \u0C15\u0C4A\u0C24\u0C4D\u0C24\u0C3F\u0C2E\u0C40\u0C30 \u0C35\u0C47\u0C38\u0C3F \u0C26\u0C3F\u0C02\u0C1A\u0C47\u0C2F\u0C3E\u0C32\u0C3F."
      ],
      mr: [
        "\u091C\u093F\u0930\u0947, \u092E\u093F\u0930\u0940 \u0906\u0923\u093F \u0932\u0938\u0942\u0923 \u0930\u092B\u0932\u0940 \u0915\u0941\u091F\u0942\u0928 \u0918\u094D\u092F\u093E.",
        "\u091A\u093F\u0902\u091A \u0915\u094B\u0933\u0942\u0928 \u0924\u094D\u092F\u093E\u0924 \u091F\u094B\u092E\u0945\u091F\u094B \u092E\u0945\u0936 \u0915\u0930\u0942\u0928 \u0918\u094D\u092F\u093E, \u092E\u0940\u0920 \u0906\u0923\u093F \u092A\u093E\u0923\u0940 \u0918\u093E\u0932\u093E.",
        "\u0924\u0935\u094D\u092F\u093E\u0935\u0930 \u0924\u0942\u092A \u0917\u0930\u092E \u0915\u0930\u0942\u0928 \u092E\u094B\u0939\u0930\u0940, \u0915\u0922\u0940\u092A\u0924\u094D\u0924\u093E, \u0939\u093F\u0902\u0917 \u092B\u094B\u0921\u0923\u0940 \u0926\u094D\u092F\u093E. \u0915\u0941\u091F\u0932\u0947\u0932\u0947 \u092E\u0938\u093E\u0932\u0947 \u0918\u093E\u0932\u093E \u0906\u0923\u093F \u0969\u0966 \u0938\u0947\u0915\u0902\u0926 \u092A\u0930\u0924\u0942\u0928 \u091A\u093F\u0902\u091A\u0947\u091A\u093E \u0930\u0938 \u0918\u093E\u0932\u0942\u0928 \u0909\u0915\u0933\u0940 \u092F\u0947\u0923\u094D\u092F\u093E\u092A\u0942\u0930\u094D\u0935\u0940 \u092C\u0902\u0926 \u0915\u0930\u093E."
      ],
      bn: [
        "\u0997\u09CB\u09B2\u09AE\u09B0\u09BF\u099A, \u099C\u09BF\u09B0\u09C7 \u0993 \u09B0\u09B8\u09C1\u09A8 \u09A5\u09C7\u0981\u09A4\u09CB \u0995\u09B0\u09C7 \u09A8\u09BF\u09A8\u0964",
        "\u098F\u0995\u099F\u09BF \u09AA\u09BE\u09A4\u09CD\u09B0\u09C7 \u09A4\u09C7\u0981\u09A4\u09C1\u09B2\u09C7\u09B0 \u099C\u09B2, \u099A\u099F\u0995\u09BE\u09A8\u09CB \u099F\u09AE\u09C7\u099F\u09CB \u0993 \u099C\u09B2 \u098F\u0995\u09B8\u09BE\u09A5\u09C7 \u09AE\u09C7\u09B6\u09BE\u09A8\u0964 \u09A8\u09C1\u09A8 \u09A6\u09BF\u09A8\u0964",
        "\u0998\u09BF \u0997\u09B0\u09AE \u0995\u09B0\u09C7 \u09B8\u09B0\u09CD\u09B7\u09C7, \u09B6\u09C1\u0995\u09A8\u09CB \u09B2\u0999\u09CD\u0995\u09BE, \u0995\u09BE\u09B0\u09BF\u09AA\u09BE\u09A4\u09BE \u0993 \u09B9\u09BF\u0982 \u09AB\u09CB\u09DC\u09A8 \u09A6\u09BF\u09A8\u0964 \u09A5\u09C7\u0981\u09A4\u09CB \u09AE\u09B6\u09B2\u09BE \u09A6\u09BF\u09DF\u09C7 \u0995\u09B7\u09BE\u09A8\u0964",
        "\u09A4\u09C7\u0981\u09A4\u09C1\u09B2 \u099F\u09AE\u09C7\u099F\u09CB\u09B0 \u09AE\u09BF\u09B6\u09CD\u09B0\u09A3\u099F\u09BF \u09A2\u09C7\u09B2\u09C7 \u09A6\u09BF\u09A8\u0964 \u09AF\u0996\u09A8 \u099A\u09BE\u09B0\u09AA\u09BE\u09B6 \u09AB\u09C1\u099F\u09A4\u09C7 \u09B6\u09C1\u09B0\u09C1 \u0995\u09B0\u09AC\u09C7, \u09A4\u0996\u09A8 \u0986\u0981\u099A \u09AC\u09A8\u09CD\u09A7 \u0995\u09B0\u09C7 \u09A6\u09BF\u09A8 \u0993 \u09A7\u09A8\u09C7\u09AA\u09BE\u09A4\u09BE \u099B\u09DC\u09BF\u09DF\u09C7 \u09A6\u09BF\u09A8\u0964"
      ],
      gu: [
        "\u0A9C\u0AC0\u0AB0\u0AC1\u0A82, \u0A95\u0ABE\u0AB3\u0ABE \u0AAE\u0AB0\u0AC0 \u0A85\u0AA8\u0AC7 \u0AB2\u0AB8\u0AA3 \u0A85\u0AA7\u0A95\u0A9A\u0AB0\u0ABE \u0AB5\u0ABE\u0A9F\u0AC0 \u0AB2\u0ACB.",
        "\u0A8F\u0A95 \u0AB5\u0ABE\u0AB8\u0AA3\u0AAE\u0ABE\u0A82 \u0A86\u0AAE\u0AB2\u0AC0\u0AA8\u0ACB \u0AB0\u0AB8, \u0A9F\u0ABE\u0AAE\u0AC7\u0A9F\u0ABE \u0A85\u0AA8\u0AC7 \u0AAA\u0ABE\u0AA3\u0AC0 \u0AAE\u0ABF\u0A95\u0ACD\u0AB8 \u0A95\u0AB0\u0ACB.",
        "\u0A98\u0AC0 \u0A97\u0AB0\u0AAE \u0A95\u0AB0\u0AC0 \u0AB0\u0ABE\u0AAF, \u0A95\u0AA2\u0AC0 \u0AAA\u0AA4\u0ACD\u0AA4\u0ABE \u0A85\u0AA8\u0AC7 \u0AB9\u0ABF\u0A82\u0A97\u0AA8\u0ACB \u0AB5\u0A98\u0ABE\u0AB0 \u0A95\u0AB0\u0AC0 \u0AB5\u0ABE\u0A9F\u0AC7\u0AB2\u0ACB \u0AAE\u0AB8\u0ABE\u0AB2\u0ACB \u0A89\u0AAE\u0AC7\u0AB0\u0AC0 \u0A86\u0AAE\u0AB2\u0AC0 \u0A9F\u0ABE\u0AAE\u0AC7\u0A9F\u0ABE\u0AA8\u0AC1\u0A82 \u0AAE\u0ABF\u0AB6\u0ACD\u0AB0\u0AA3 \u0A89\u0AAE\u0AC7\u0AB0\u0ACB, \u0A89\u0AAD\u0AB0\u0ACB \u0A86\u0AB5\u0AC7 \u0A8F\u0A9F\u0AB2\u0AC7 \u0A97\u0AC7\u0AB8 \u0AAC\u0A82\u0AA7 \u0A95\u0AB0\u0ACB."
      ]
    },
    prepTime: 10,
    tags: ["Vegetarian", "Gluten Free", "Tangy & Healing", "South Indian"],
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "r3",
    title: {
      hi: "\u0917\u0941\u091C\u0930\u093E\u0924\u0940 \u0916\u092E\u0928 \u0922\u094B\u0915\u0932\u093E",
      en: "Gujarati Khaman Dhokla",
      ta: "\u0B95\u0BC1\u0B9C\u0BB0\u0BBE\u0BA4\u0BCD\u0BA4\u0BBF \u0B95\u0BAE\u0BA9\u0BCD \u0BA4\u0BCB\u0B95\u0BCD\u0BB3\u0BBE",
      te: "\u0C16\u0C2E\u0C28\u0C4D \u0C21\u0C4B\u0C15\u0C4D\u0C32\u0C3E",
      mr: "\u0916\u092E\u0928 \u0922\u094B\u0915\u0933\u093E",
      bn: "\u0996\u09BE\u09AE\u09BE\u09A8 \u09A2\u09CB\u0995\u09B2\u09BE",
      gu: "\u0A96\u0AAE\u0AA3 \u0AA2\u0ACB\u0A95\u0AB3\u0ABE"
    },
    ingredients: [
      { name: "Besan (Gram Flour)", amount: "1.5 cups" },
      { name: "Suji (Semolina)", amount: "1 tbsp" },
      { name: "Citric acid or Lemon Juice", amount: "1 tsp" },
      { name: "Sugar", amount: "1.5 tsp" },
      { name: "Ginger-Chilli Paste", amount: "1 tsp" },
      { name: "Eno (Fruit Salt)", amount: "1 tsp" },
      { name: "Mustard Seeds", amount: "1 tsp" },
      { name: "Green Chilli (slit)", amount: "3-4" },
      { name: "Hing", amount: "a pinch" },
      { name: "Coriander & Coconut flakes", amount: "for garnish" }
    ],
    instructions: {
      en: [
        "Whisk besan, suji, turmeric, sugar, salt, lemon juice, ginger-chilli paste, and water to make a smooth batter.",
        "Set up a steamer with plenty of water. Grease a tin cake pan with oil.",
        "Add Eno fruit salt to the batter and stir quickly. The batter will double in size and froth up beautifully.",
        "Pour the batter immediately into the greased tin and steam for 15 minutes.",
        "For the tempering, heat oil in a small pan. Add mustard seeds, curry leaves, green chillies, and a pinch of hing.",
        "Pour a half cup of water and 1 tbsp sugar into the tempering pan and bring to boil.",
        "Cut the steamed dhokla into neat squares and drizzle the sugary aromatic water over them evenly.",
        "Garnish with chopped coriander, shredded fresh coconut, and serve with sweet-sour mint chutney."
      ],
      hi: [
        "\u092C\u0947\u0938\u0928, \u0938\u0942\u091C\u0940, \u092A\u093E\u0928\u0940, \u0928\u0940\u0902\u092C\u0942 \u0930\u0938, \u0905\u0926\u0930\u0915-\u092E\u093F\u0930\u094D\u091A \u092A\u0947\u0938\u094D\u091F, \u091A\u0940\u0928\u0940 \u0914\u0930 \u0928\u092E\u0915 \u092E\u093F\u0932\u093E\u0915\u0930 \u091A\u093F\u0915\u0928\u093E \u0918\u094B\u0932 \u0924\u0948\u092F\u093E\u0930 \u0915\u0930 \u0932\u0947\u0902\u0964",
        "\u0927\u094B\u0915\u0932\u093E \u092A\u0915\u093E\u0928\u0947 \u0935\u093E\u0932\u0947 \u0938\u094D\u091F\u0940\u092E\u0930 \u0915\u094B \u0917\u0930\u094D\u092E \u0915\u0930\u0947\u0902 \u0914\u0930 \u090F\u0915 \u092C\u0930\u094D\u0924\u0928 \u092E\u0947\u0902 \u0925\u094B\u0921\u093C\u093E \u0924\u0947\u0932 \u0932\u0917\u093E\u0915\u0930 \u091A\u093F\u0915\u0928\u093E \u0915\u0930\u0947\u0902\u0964",
        "\u0918\u094B\u0932 \u092E\u0947\u0902 \u0908\u0928\u094B \u092B\u094D\u0930\u0942\u091F \u0938\u093E\u0932\u094D\u091F \u0921\u093E\u0932\u0915\u0930 \u091C\u0932\u094D\u0926\u0940-\u091C\u0932\u094D\u0926\u0940 \u090F\u0915 \u0939\u0940 \u0926\u093F\u0936\u093E \u092E\u0947\u0902 \u092B\u0947\u0902\u091F\u0947\u0902\u0964 \u0918\u094B\u0932 \u090F\u0915\u0926\u092E \u092B\u0942\u0932 \u091C\u093E\u090F\u0917\u093E\u0964",
        "\u0907\u0938\u0947 \u0924\u0941\u0930\u0902\u0924 \u091A\u093F\u0915\u0928\u0947 \u092C\u0930\u094D\u0924\u0928 \u092E\u0947\u0902 \u0921\u093E\u0932\u0915\u0930 \u0938\u094D\u091F\u0940\u092E\u0930 \u092E\u0947\u0902 \u0967\u096B \u092E\u093F\u0928\u091F \u0915\u0947 \u0932\u093F\u090F \u092D\u093E\u092A \u092A\u0930 \u092A\u0915\u093E\u090F\u0902\u0964",
        "\u0924\u0921\u093C\u0915\u0947 \u0915\u0947 \u0932\u093F\u090F: \u090F\u0915 \u091B\u094B\u091F\u0940 \u0915\u0922\u093C\u093E\u0908 \u092E\u0947\u0902 \u0924\u0947\u0932 \u0917\u0930\u094D\u092E \u0915\u0930\u0947\u0902, \u0930\u093E\u0908, \u0939\u0930\u0940 \u092E\u093F\u0930\u094D\u091A, \u0915\u0922\u093C\u0940 \u092A\u0924\u094D\u0924\u093E \u0914\u0930 \u0939\u0940\u0902\u0917 \u0921\u093E\u0932\u0947\u0902\u0964",
        "\u0924\u0921\u093C\u0915\u0947 \u092E\u0947\u0902 \u0932\u0917\u092D\u0917 \u0906\u0927\u093E \u0915\u092A \u092A\u093E\u0928\u0940 \u0914\u0930 \u0925\u094B\u0921\u093C\u0940 \u091A\u0940\u0928\u0940 \u0921\u093E\u0932\u0915\u0930 \u0906\u0902\u091A \u0924\u0947\u091C \u0915\u0930\u0947\u0902 \u091C\u092C \u0924\u0915 \u091A\u0940\u0928\u0940 \u0918\u0941\u0932 \u0928 \u091C\u093E\u090F\u0964",
        "\u0922\u094B\u0915\u0932\u093E \u0915\u094B \u091A\u094C\u0915\u094B\u0930 \u0915\u093E\u091F\u0915\u0930 \u0909\u0938 \u092A\u0930 \u0924\u0921\u093C\u0915\u0947 \u0935\u093E\u0932\u093E \u092A\u093E\u0928\u0940 \u091A\u093E\u0930\u094B\u0902 \u0924\u0930\u092B \u092C\u0930\u093E\u092C\u0930 \u092B\u0948\u0932\u093E \u0926\u0947\u0902\u0964",
        "\u0915\u091F\u0947 \u0927\u0928\u093F\u092F\u093E \u0914\u0930 \u0915\u0926\u094D\u0926\u0942\u0915\u0938 \u0928\u093E\u0930\u093F\u092F\u0932 \u0938\u0947 \u0938\u091C\u093E\u0915\u0930 \u0906\u0928\u0902\u0926 \u0932\u0947\u0902\u0964"
      ],
      ta: [
        "\u0B95\u0B9F\u0BB2\u0BC8 \u0BAE\u0BBE\u0BB5\u0BC1, \u0BB0\u0BB5\u0BC8, \u0B8E\u0BB2\u0BC1\u0BAE\u0BBF\u0B9A\u0BCD\u0B9A\u0BC8 \u0B9A\u0BBE\u0BB1\u0BC1, \u0B87\u0B9E\u0BCD\u0B9A\u0BBF \u0BAE\u0BBF\u0BB3\u0B95\u0BBE\u0BAF\u0BCD \u0BB5\u0BBF\u0BB4\u0BC1\u0BA4\u0BC1, \u0B9A\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BB0\u0BC8 \u0B9A\u0BC7\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BC1 \u0BAE\u0BBE\u0BB5\u0BC1 \u0B95\u0BB0\u0BC8\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BCD \u0B95\u0BCA\u0BB3\u0BCD\u0BB3\u0BB5\u0BC1\u0BAE\u0BCD.",
        "\u0B88\u0BA9\u0BCB \u0B9A\u0BC7\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BC1 \u0B89\u0B9F\u0BA9\u0BC7 \u0BA4\u0B9F\u0BCD\u0B9F\u0BBF\u0BB2\u0BCD \u0B8A\u0BB1\u0BCD\u0BB1\u0BBF 15 \u0BA8\u0BBF\u0BAE\u0BBF\u0B9F\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B86\u0BB5\u0BBF\u0BAF\u0BBF\u0BB2\u0BCD \u0BB5\u0BC7\u0B95 \u0BB5\u0BC8\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD.",
        "\u0B8E\u0BA3\u0BCD\u0BA3\u0BC6\u0BAF\u0BBF\u0BB2\u0BCD \u0B95\u0B9F\u0BC1\u0B95\u0BC1, \u0B95\u0BB1\u0BBF\u0BB5\u0BC7\u0BAA\u0BCD\u0BAA\u0BBF\u0BB2\u0BC8, \u0BAA\u0B9A\u0BCD\u0B9A\u0BC8 \u0BAE\u0BBF\u0BB3\u0B95\u0BBE\u0BAF\u0BCD \u0BA4\u0BBE\u0BB3\u0BBF\u0BA4\u0BCD\u0BA4\u0BC1, \u0BA4\u0BA3\u0BCD\u0BA3\u0BC0\u0BB0\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0B9A\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BB0\u0BC8 \u0B9A\u0BC7\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BC1 \u0B95\u0BCA\u0BA4\u0BBF\u0B95\u0BCD\u0B95 \u0BB5\u0BC8\u0BA4\u0BCD\u0BA4\u0BC1 \u0BB5\u0BC6\u0BA8\u0BCD\u0BA4 \u0BA4\u0BCB\u0B95\u0BCD\u0BB3\u0BBE \u0BAE\u0BC7\u0BB2\u0BCD \u0B8A\u0BB1\u0BCD\u0BB1\u0BB5\u0BC1\u0BAE\u0BCD."
      ],
      te: [
        "\u0C36\u0C28\u0C17\u0C2A\u0C3F\u0C02\u0C21\u0C3F, \u0C30\u0C35\u0C4D\u0C35, \u0C28\u0C3F\u0C2E\u0C4D\u0C2E\u0C30\u0C38\u0C02, \u0C05\u0C32\u0C4D\u0C32\u0C02 \u0C2E\u0C3F\u0C30\u0C4D\u0C1A\u0C3F \u0C2A\u0C47\u0C38\u0C4D\u0C1F\u0C4D, \u0C2A\u0C02\u0C1A\u0C26\u0C3E\u0C30 \u0C35\u0C47\u0C38\u0C3F \u0C28\u0C40\u0C1F\u0C3F\u0C24\u0C4B \u0C1C\u0C3E\u0C30\u0C41\u0C17\u0C3E \u0C15\u0C32\u0C41\u0C2A\u0C41\u0C15\u0C4B\u0C02\u0C21\u0C3F.",
        "\u0C08\u0C28\u0C4B \u0C38\u0C3E\u0C32\u0C4D\u0C1F\u0C4D \u0C35\u0C47\u0C38\u0C3F \u0C15\u0C32\u0C3F\u0C2A\u0C3F, \u0C2A\u0C3E\u0C24\u0C4D\u0C30\u0C15\u0C41 \u0C28\u0C42\u0C28\u0C46 \u0C30\u0C3E\u0C38\u0C3F \u0C2A\u0C3F\u0C02\u0C21\u0C3F\u0C28\u0C3F \u0C2A\u0C4B\u0C38\u0C3F 15 \u0C28\u0C3F\u0C2E\u0C3F\u0C37\u0C3E\u0C32\u0C41 \u0C06\u0C35\u0C3F\u0C30\u0C3F\u0C2A\u0C48 \u0C09\u0C21\u0C3F\u0C15\u0C3F\u0C02\u0C1A\u0C3E\u0C32\u0C3F.",
        "\u0C2A\u0C4B\u0C2A\u0C41 \u0C35\u0C47\u0C38\u0C3F \u0C05\u0C02\u0C26\u0C41\u0C32\u0C4B \u0C15\u0C4A\u0C26\u0C4D\u0C26\u0C3F\u0C17\u0C3E \u0C28\u0C40\u0C30\u0C41, \u0C2A\u0C02\u0C1A\u0C26\u0C3E\u0C30 \u0C35\u0C47\u0C38\u0C3F \u0C2E\u0C30\u0C3F\u0C17\u0C3F\u0C02\u0C1A\u0C3F, \u0C09\u0C21\u0C3F\u0C15\u0C3F\u0C28 \u0C21\u0C4B\u0C15\u0C4D\u0C32\u0C3E \u0C2E\u0C41\u0C15\u0C4D\u0C15\u0C32\u0C2A\u0C48 \u0C1A\u0C32\u0C4D\u0C32\u0C3E\u0C32\u0C3F."
      ],
      mr: [
        "\u092C\u0947\u0938\u0928, \u0938\u0941\u091C\u0940, \u0932\u093F\u0902\u092C\u093E\u091A\u093E \u0930\u0938, \u0906\u0932\u0947-\u092E\u093F\u0930\u091A\u0940 \u092A\u0947\u0938\u094D\u091F \u0906\u0923\u093F \u092A\u093E\u0923\u0940 \u090F\u0915\u0924\u094D\u0930 \u092B\u0947\u091F\u0942\u0928 \u0918\u094D\u092F\u093E. \u0938\u094D\u091F\u0940\u092E\u0930 \u0924\u092F\u093E\u0930 \u0920\u0947\u0935\u093E.",
        "\u092E\u093F\u0936\u094D\u0930\u0923\u093E\u0924 \u0907\u0928\u094B \u0918\u093E\u0932\u0942\u0928 \u0935\u094D\u092F\u0935\u0938\u094D\u0925\u093F\u0924 \u0939\u0932\u0935\u093E, \u0924\u0947\u0932 \u0932\u093E\u0935\u0932\u0947\u0932\u094D\u092F\u093E \u092D\u093E\u0902\u0921\u094D\u092F\u093E\u0924 \u0932\u0917\u0947\u091A \u0913\u0924\u0942\u0928 \u0967\u096B \u092E\u093F\u0928\u093F\u091F\u0947 \u0935\u093E\u092B\u0935\u0942\u0928 \u0918\u094D\u092F\u093E.",
        "\u092B\u094B\u0933\u0923\u0940\u0938\u093E\u0920\u0940 \u0924\u0947\u0932 \u0917\u0930\u092E \u0915\u0930\u0942\u0928 \u092E\u094B\u0939\u0930\u0940, \u0915\u0922\u0940\u092A\u0924\u094D\u0924\u093E, \u092C\u093E\u0930\u0940\u0915 \u091A\u093F\u0930\u0932\u0947\u0932\u0940 \u092E\u093F\u0930\u091A\u0940 \u0918\u093E\u0932\u093E, \u0925\u094B\u0921\u0947 \u0924\u094D\u092F\u093E\u0924 \u092A\u093E\u0923\u0940 \u0935 \u0938\u093E\u0916\u0930 \u0918\u093E\u0932\u0942\u0928 \u0924\u0947 \u0917\u0930\u092E \u092B\u094B\u0921\u0923\u0940\u091A\u0947 \u092A\u093E\u0923\u0940 \u0922\u094B\u0915\u0933\u094D\u092F\u093E\u0935\u0930 \u0938\u0930\u094D\u0935\u0924\u094D\u0930 \u092A\u0938\u0930\u093E."
      ],
      bn: [
        "\u09AC\u09C7\u09B8\u09A8, \u09B8\u09C1\u099C\u09BF, \u09B2\u09C7\u09AC\u09C1\u09B0 \u09B0\u09B8, \u0986\u09A6\u09BE-\u09B2\u0999\u09CD\u0995\u09BE\u09B0 \u09AA\u09C7\u09B8\u09CD\u099F, \u099A\u09BF\u09A8\u09BF \u0993 \u09A8\u09C1\u09A8 \u09AE\u09BF\u09B6\u09BF\u09DF\u09C7 \u099C\u09B2 \u09A6\u09BF\u09DF\u09C7 \u09AC\u09CD\u09AF\u09BE\u099F\u09BE\u09B0 \u09AC\u09BE\u09A8\u09BE\u09A8\u0964",
        "\u09AC\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09C7 \u0987\u09A8\u09CB \u09A6\u09BF\u09DF\u09C7 \u09A6\u09CD\u09B0\u09C1\u09A4 \u09AB\u09C1\u099F\u09BF\u09DF\u09C7 \u09A8\u09BF\u09A8\u0964 \u0997\u09CD\u09B0\u09BF\u099C \u0995\u09B0\u09BE \u09AA\u09BE\u09A4\u09CD\u09B0\u09C7 \u09AC\u09CD\u09AF\u09BE\u099F\u09BE\u09B0 \u09A2\u09C7\u09B2\u09C7 \u09E7\u09EB \u09AE\u09BF\u09A8\u09BF\u099F \u09AD\u09BE\u09AA\u09BF\u09DF\u09C7 \u09A8\u09BF\u09A8\u0964",
        "\u09AB\u09CB\u09DC\u09A8\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0995\u09DC\u09BE\u0987\u09A4\u09C7 \u09B8\u09B0\u09CD\u09B7\u09C7, \u0995\u09BE\u09B0\u09BF\u09AA\u09BE\u09A4\u09BE \u0993 \u0995\u09BE\u0981\u099A\u09BE\u09B2\u0999\u09CD\u0995\u09BE \u09AD\u09BE\u099C\u09C1\u09A8\u0964 \u09B8\u09BE\u09AE\u09BE\u09A8\u09CD\u09AF \u099C\u09B2 \u0993 \u099A\u09BF\u09A8\u09BF \u09A6\u09BF\u09DF\u09C7 \u09AB\u09C1\u099F\u09BF\u09DF\u09C7 \u09A8\u09BF\u09A8\u0964",
        "\u09A2\u09CB\u0995\u09B2\u09BE \u0995\u09C7\u099F\u09C7 \u0993\u09AA\u09B0 \u09A5\u09C7\u0995\u09C7 \u09AE\u09BF\u09B7\u09CD\u099F\u09BF \u09AB\u09CB\u09DC\u09A8\u09C7\u09B0 \u099C\u09B2 \u099B\u09DC\u09BF\u09DF\u09C7 \u09AA\u09B0\u09BF\u09AC\u09C7\u09B6\u09A8 \u0995\u09B0\u09C1\u09A8\u0964"
      ],
      gu: [
        "\u0AAC\u0AC7\u0AB8\u0AA8, \u0AB8\u0ACB\u0A9C\u0AC0, \u0A96\u0ABE\u0A82\u0AA1, \u0A86\u0AA6\u0AC1 \u0AAE\u0AB0\u0A9A\u0ABE\u0AA8\u0AC0 \u0AAA\u0AC7\u0AB8\u0ACD\u0A9F, \u0AB2\u0AC0\u0A82\u0AAC\u0AC1\u0AA8\u0ACB \u0AB0\u0AB8 \u0A85\u0AA8\u0AC7 \u0AAE\u0AC0\u0AA0\u0AC1\u0A82 \u0A89\u0AAE\u0AC7\u0AB0\u0AC0 \u0AAC\u0AC7\u0A9F\u0AB0 \u0AAC\u0AA8\u0ABE\u0AB5\u0ACB.",
        "\u0AA4\u0AC7\u0AAE\u0ABE\u0A82 \u0A88\u0AA8\u0ACB \u0A89\u0AAE\u0AC7\u0AB0\u0AC0\u0AA8\u0AC7 \u0AAC\u0AB0\u0ABE\u0AAC\u0AB0 \u0AB9\u0AB2\u0ABE\u0AB5\u0ACB, \u0A97\u0ACD\u0AB0\u0AC0\u0AB8 \u0A95\u0AB0\u0AC7\u0AB2\u0AC0 \u0AA5\u0ABE\u0AB3\u0AC0\u0AAE\u0ABE\u0A82 \u0AAC\u0AC7\u0A9F\u0AB0 \u0AB0\u0AC7\u0AA1\u0AC0\u0AA8\u0AC7 \u0AE7\u0AEB \u0AAE\u0ABF\u0AA8\u0ABF\u0A9F \u0AAE\u0ABE\u0A9F\u0AC7 \u0AB8\u0ACD\u0A9F\u0AC0\u0AAE \u0A95\u0AB0\u0ACB.",
        "\u0AB5\u0A98\u0ABE\u0AB0 \u0AAE\u0ABE\u0A9F\u0AC7 \u0AA4\u0AC7\u0AB2\u0AAE\u0ABE\u0A82 \u0AB0\u0ABE\u0A88, \u0AB2\u0AC0\u0AB2\u0ABE \u0AAE\u0AB0\u0A9A\u0ABE \u0A85\u0AA8\u0AC7 \u0A96\u0ABE\u0A82\u0AA1\u0AA8\u0AC1\u0A82 \u0AAA\u0ABE\u0AA3\u0AC0 \u0A89\u0A95\u0ABE\u0AB3\u0AC0 \u0AB8\u0AB0\u0A96\u0ABE \u0AAA\u0ACD\u0AB0\u0AAE\u0ABE\u0AA3\u0AAE\u0ABE\u0A82 \u0AA2\u0ACB\u0A95\u0AB3\u0ABE \u0AAA\u0AB0 \u0AB0\u0AC7\u0AA1\u0ACB, \u0A95\u0ACB\u0AA5\u0AAE\u0AC0\u0AB0\u0AA5\u0AC0 \u0AB8\u0A9C\u0ABE\u0AB5\u0ACB."
      ]
    },
    prepTime: 25,
    tags: ["Vegetarian", "Steamed", "Gujarati Special", "Low Calorie"],
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=60"
  }
];
var geminiAI = null;
function getGemini() {
  if (!geminiAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined. Falling back to Mock Gemini responses.");
      return null;
    }
    geminiAI = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return geminiAI;
}
app.get("/api/mandi-prices", (req, res) => {
  res.json({ prices: INDIAN_MANDI_PRICES });
});
app.post("/api/gemini/scan-vegetables", async (req, res) => {
  const { image } = req.body;
  if (!image) {
    return res.status(400).json({ error: "Missing image base64 data" });
  }
  const ai = getGemini();
  if (!ai) {
    return res.json({
      success: true,
      simulated: true,
      items: [
        { name: "Tomato", quantity: 500, unit: "g", category: "Vegetable", confidence: 0.95, freshRating: 88, expiryDays: 6, bbox: [20, 30, 45, 60] },
        { name: "Onion", quantity: 1e3, unit: "g", category: "Vegetable", confidence: 0.92, freshRating: 95, expiryDays: 14, bbox: [50, 10, 80, 45] },
        { name: "Green Chilli", quantity: 100, unit: "g", category: "Spice", confidence: 0.89, freshRating: 90, expiryDays: 8, bbox: [75, 50, 95, 80] }
      ]
    });
  }
  try {
    const cleanImage = image.replace(/^data:image\/\w+;base64,/, "");
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: cleanImage
          }
        },
        "You are 'RasoiSaathi', an expert Indian kitchen computer vision model. Identify the vegetables, ingredients, or cooking groceries in this image. For each detected item, specify its english name, estimated quantity, standard cooking unit (e.g., 'g', 'kg', 'units'), kitchen category ('Vegetable', 'Spice', 'Dairy', 'Fruit', 'Grain'), visual confidence (0.0 to 1.0), estimated freshness score (0 to 100), and projected days until spoilage/expiry based on its visual state. Respond with raw JSON following this schema: { items: Array<{ name: string, quantity: number, unit: string, category: string, confidence: number, freshRating: number, expiryDays: number }> } "
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            items: {
              type: import_genai.Type.ARRAY,
              description: "List of identified kitchen items from image.",
              items: {
                type: import_genai.Type.OBJECT,
                properties: {
                  name: { type: import_genai.Type.STRING },
                  quantity: { type: import_genai.Type.INTEGER },
                  unit: { type: import_genai.Type.STRING },
                  category: { type: import_genai.Type.STRING },
                  confidence: { type: import_genai.Type.NUMBER },
                  freshRating: { type: import_genai.Type.INTEGER },
                  expiryDays: { type: import_genai.Type.INTEGER }
                },
                required: ["name", "quantity", "unit", "category", "confidence", "freshRating", "expiryDays"]
              }
            }
          },
          required: ["items"]
        }
      }
    });
    const parsedData = JSON.parse(response.text || "{}");
    const itemsWithBbox = (parsedData.items || []).map((item, idx) => {
      const bboxes = [
        [15, 20, 45, 50],
        [50, 15, 85, 55],
        [30, 50, 75, 85],
        [10, 60, 40, 90]
      ];
      return {
        ...item,
        bbox: bboxes[idx % bboxes.length]
      };
    });
    res.json({ success: true, items: itemsWithBbox, simulated: false });
  } catch (error) {
    console.warn("Gemini Scan Error (using simulated fallback):", error.message || error);
    res.json({
      success: true,
      simulated: true,
      items: [
        { name: "Tomato", quantity: 500, unit: "g", category: "Vegetable", confidence: 0.95, freshRating: 88, expiryDays: 6, bbox: [20, 30, 45, 60] },
        { name: "Onion", quantity: 1e3, unit: "g", category: "Vegetable", confidence: 0.92, freshRating: 95, expiryDays: 14, bbox: [50, 10, 80, 45] },
        { name: "Green Chilli", quantity: 100, unit: "g", category: "Spice", confidence: 0.89, freshRating: 90, expiryDays: 8, bbox: [75, 50, 95, 80] }
      ]
    });
  }
});
app.post("/api/gemini/voice-query", async (req, res) => {
  const { query, language, familyProfile, pantry } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Missing query text" });
  }
  const ai = getGemini();
  const systemInstruction = `
    You are 'RasoiSaathi', an intuitive, native Indian AI kitchen assistant.
    You respond elegantly in code-switched multi-lingual Indian styles (using words like 'Aap', 'Beta', 'Tiffin', 'Ghar ka swad').
    The user's query may be in Hinglish, English, or localized Indian scripts (${language || "en"}).
    And you operate based on this kitchen state:
    Current Pantry inventory: ${JSON.stringify(pantry || [])}
    Family Dietary/Allergy Profiles: ${JSON.stringify(familyProfile || {})}
    
    Respond in raw JSON matching the following structure:
    {
      "intent": "RECIPE_SEARCH" | "SUBSTITUTE_FINDER" | "EXPIRY_CHECK" | "PREFERENCE_UPDATE" | "GENERAL_ASSIST",
      "voiceResponse": "Warm verbal greeting response here, conversational, helpful, brief (max 3 sentences)",
      "markdownDetail": "Detailed markdown explanation or recipes with ingredients, substitute table, safety notices, and tips in ${language || "en"}",
      "suggestedAction": string (e.g. "cook_bhurji", "view_pantry"),
      "suggestedRecipes": Array<any>
    }
  `;
  if (!ai) {
    const simulatedResponse = {
      intent: query.toLowerCase().includes("substitute") ? "SUBSTITUTE_FINDER" : "RECIPE_SEARCH",
      voiceResponse: `Arre wah! Suna aapne paneer aur shimla mirch ke baare mein pucha. Main aapko jhatpat Paneer Tikka ya Shimla Mirch Paneer banakar dila sakti hoon!`,
      markdownDetail: `### \u{1F372} RasoiSaathi Smart Recommendations

Humare paas pantry me fresh **Paneer** aur **Shimla Mirch (Capsicum)** hai. Yeh rahi jhatpat recipe:

#### **Kadhai Shimla-Paneer (Low-Oil)**
- **Prep Time:** 15 mins | **Servings:** 2
- **Nutrition:** High Protein, Diabetic Friendly

| Ingredient | Quantity | Status |
|---|---|---|
| Paneer | 200g | Available \u2705 |
| Onion / Tomato | 1 each | Available \u2705 |
| Capsicum (Shimla Mirch) | 1 cup | Available \u2705 |
| Garam Masala | 1 tsp | Spice Box \u2705 |

*Tip:* Agar tamatar kam hain, to dahi ya nimbu ka ras use kar sakte hain! Jaaniye aur options.`,
      suggestedAction: "cook_paneer",
      suggestedRecipes: [SEED_RECIPES[0]]
    };
    return res.json(simulatedResponse);
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Query: "${query}" in target language: "${language || "en"}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            intent: { type: import_genai.Type.STRING },
            voiceResponse: { type: import_genai.Type.STRING },
            markdownDetail: { type: import_genai.Type.STRING },
            suggestedAction: { type: import_genai.Type.STRING },
            suggestedRecipes: {
              type: import_genai.Type.ARRAY,
              items: { type: import_genai.Type.OBJECT }
            }
          },
          required: ["intent", "voiceResponse", "markdownDetail", "suggestedAction"]
        }
      }
    });
    res.json(JSON.parse(response.text || "{}"));
  } catch (error) {
    console.warn("Gemini Voice Router error (using simulated fallback):", error.message || error);
    const simulatedResponse = {
      intent: query.toLowerCase().includes("substitute") ? "SUBSTITUTE_FINDER" : "RECIPE_SEARCH",
      voiceResponse: `Arre wah! Mainne aapka swaal suna: "${query}". Abhi hum offline support use kar rahe hain, par main aapko humari recipe suggest kar sakti hoon!`,
      markdownDetail: `### \u{1F372} RasoiSaathi Smart Recommendations (Resilient Mode)
      
Humare paas pantry me fresh **Paneer** aur **Shimla Mirch (Capsicum)** hai. Yeh rahi jhatpat recipe:

#### **Kadhai Shimla-Paneer (Low-Oil)**
- **Prep Time:** 15 mins | **Servings:** 2
- **Nutrition:** High Protein, Diabetic Friendly

| Ingredient | Quantity | Status |
|---|---|---|
| Paneer | 200g | Available \u2705 |
| Onion / Tomato | 1 each | Available \u2705 |
| Capsicum (Shimla Mirch) | 1 cup | Available \u2705 |
| Garam Masala | 1 tsp | Spice Box \u2705 |

*Tip:* It looks like you asked: "${query}". If you need specific substitutes, remember that you can substitute cream with thick curd or fresh malai!`,
      suggestedAction: "cook_paneer",
      suggestedRecipes: [SEED_RECIPES[0]]
    };
    res.json(simulatedResponse);
  }
});
app.post("/api/gemini/get-suggestion", async (req, res) => {
  const { pantry, familyState, weatherState, timeOfDay } = req.body;
  const ai = getGemini();
  const systemInstruction = `
    You are 'RasoiSaathi', the premium Indian kitchen RAG orchestrator.
    Evaluate the items in client's pantry: ${JSON.stringify(pantry || [])}
    And family parameters: ${JSON.stringify(familyState || {})}
    Weather today: ${weatherState || "Pleasant, cloudy"}
    Time of day: ${timeOfDay || "Evening"}
    
    Select or dynamically craft 3 personalized Indian recipes.
    Ensure to respect dietary restrictions (diabetic friendly, no onion-garlic if requested, child-tiffin friendly).
    Provide structural recipes returned exactly like this JSON schema:
    {
      "explanation": "Brief reasoning of why this was curated for them (e.g. 'Since it is raining in New Delhi, and you have potatoes, how about making piping hot Pakoras safely balanced for your husband's sugar level?')",
      "curatedRecipes": Array<{
        "id": string,
        "title": Record<string, string>, // {hi: string, en: string, ta: string, te: string, mr: string, bn: string, gu: string}
        "prepTime": number,
        "tags": string[],
        "ingredients": Array<{ name: string, amount: string }>,
        "instructions": Record<string, string[]>, // {hi: string[], en: string[], ta: string[], ...}
        "imageUrl": string
      }>
    }
  `;
  if (!ai) {
    return res.json({
      explanation: "Curated perfectly based on your warm evening weather in Mumbai and diabetic-friendly family profile.",
      curatedRecipes: SEED_RECIPES,
      isFallback: true,
      errorType: "NO_API_KEY"
    });
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Select the absolute best meals matching the user state.",
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            explanation: { type: import_genai.Type.STRING },
            curatedRecipes: {
              type: import_genai.Type.ARRAY,
              items: {
                type: import_genai.Type.OBJECT,
                properties: {
                  id: { type: import_genai.Type.STRING },
                  title: {
                    type: import_genai.Type.OBJECT,
                    properties: {
                      hi: { type: import_genai.Type.STRING },
                      en: { type: import_genai.Type.STRING },
                      ta: { type: import_genai.Type.STRING },
                      te: { type: import_genai.Type.STRING },
                      mr: { type: import_genai.Type.STRING },
                      bn: { type: import_genai.Type.STRING },
                      gu: { type: import_genai.Type.STRING }
                    }
                  },
                  prepTime: { type: import_genai.Type.INTEGER },
                  tags: {
                    type: import_genai.Type.ARRAY,
                    items: { type: import_genai.Type.STRING }
                  },
                  ingredients: {
                    type: import_genai.Type.ARRAY,
                    items: {
                      type: import_genai.Type.OBJECT,
                      properties: {
                        name: { type: import_genai.Type.STRING },
                        amount: { type: import_genai.Type.STRING }
                      }
                    }
                  },
                  instructions: {
                    type: import_genai.Type.OBJECT,
                    properties: {
                      hi: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
                      en: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
                      ta: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
                      te: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
                      mr: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
                      bn: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
                      gu: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } }
                    }
                  },
                  imageUrl: { type: import_genai.Type.STRING }
                }
              }
            }
          },
          required: ["explanation", "curatedRecipes"]
        }
      }
    });
    res.json(JSON.parse(response.text || "{}"));
  } catch (error) {
    console.warn("Gemini suggestion soft failure (using fallback seed recipes):", error.message || error);
    const errStr = error.message || String(error);
    const isQuota = errStr.includes("quota") || errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED");
    res.json({
      explanation: "Swagat hai! Sourced successfully from regional season and diabetic-friendly profiles.",
      curatedRecipes: SEED_RECIPES,
      isFallback: true,
      errorType: isQuota ? "QUOTA_EXHAUSTED" : "API_ERROR",
      errorMessage: errStr
    });
  }
});
app.post("/api/gemini/grocery-plan", async (req, res) => {
  const { pantry, familyState, budgetMultiplier } = req.body;
  const ai = getGemini();
  const systemInstruction = `
    You are 'RasoiSaathi', an expert nutrition and budget-friendly Indian grocery planner.
    Analyze upcoming weekly requirements for diet rules: ${JSON.stringify(familyState || {})}
    Against current ingredients: ${JSON.stringify(pantry || [])}
    And average mandi prices to make an optimal, budget-conscious plan.
    
    Structure the response exactly as:
    {
      "mealsPlanned": Array<{ day: string, breakfast: string, lunch: string, dinner: string }>,
      "groceryItems": Array<{ name: string, quantityNeeded: string, estimatedPrice: number, category: string, reason: string }>,
      "costEfficiencyScore": number, // 0 to 100
      "mandiTip": string // how to buy cheaper this week
    }
  `;
  if (!ai) {
    return res.json({
      mealsPlanned: [
        { day: "Monday", breakfast: "Poha", lunch: "Dal Tadka & Rice", dinner: "Paneer Bhurji" },
        { day: "Tuesday", breakfast: "Idli Sambar", lunch: "Rasam Mudda Rice", dinner: "Alloo Gobhi" },
        { day: "Wednesday", breakfast: "Dhokla", lunch: "Khichdi Kadhi", dinner: "Methi Thepla" },
        { day: "Thursday", breakfast: "Aloo Parantha", lunch: "Mixed Vegetable Sabji", dinner: "Sambar Vada" },
        { day: "Friday", breakfast: "Upma", lunch: "Chole Bhature", dinner: "Bhindi Masala" },
        { day: "Saturday", breakfast: "Suji Halwa", lunch: "Kadhi Pakora", dinner: "Moong Dal Cheela" },
        { day: "Sunday", breakfast: "Paneer Parantha", lunch: "Veg Biryani & Tomato Rasam", dinner: "Jeera Aloo Roti" }
      ],
      groceryItems: [
        { name: "Tomato", quantityNeeded: "1.5 kg", estimatedPrice: 48, category: "Vegetable", reason: "For Rasam, gravy gravies and Sambar preparations" },
        { name: "Garlic", quantityNeeded: "250g", estimatedPrice: 41, category: "Spice", reason: "Mandi prices down by 8%, stock up now" },
        { name: "Wheat Atta", quantityNeeded: "5 kg", estimatedPrice: 220, category: "Grain", reason: "Weekly staple for rotis/paranthas" },
        { name: "Paneer", quantityNeeded: "400g", estimatedPrice: 144, category: "Dairy", reason: "High-protein balance to meet senior members needs" }
      ],
      costEfficiencyScore: 92,
      mandiTip: "Onion prices are rising in Nashik Mandis. Avoid deep onion-loaded gravies this week and substitute partially with rich tomato-curd purees which are currently 12% cheaper!",
      isFallback: true,
      errorType: "NO_API_KEY"
    });
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Plan the grocery items and meals.",
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            mealsPlanned: {
              type: import_genai.Type.ARRAY,
              items: {
                type: import_genai.Type.OBJECT,
                properties: {
                  day: { type: import_genai.Type.STRING },
                  breakfast: { type: import_genai.Type.STRING },
                  lunch: { type: import_genai.Type.STRING },
                  dinner: { type: import_genai.Type.STRING }
                }
              }
            },
            groceryItems: {
              type: import_genai.Type.ARRAY,
              items: {
                type: import_genai.Type.OBJECT,
                properties: {
                  name: { type: import_genai.Type.STRING },
                  quantityNeeded: { type: import_genai.Type.STRING },
                  estimatedPrice: { type: import_genai.Type.INTEGER },
                  category: { type: import_genai.Type.STRING },
                  reason: { type: import_genai.Type.STRING }
                }
              }
            },
            costEfficiencyScore: { type: import_genai.Type.INTEGER },
            mandiTip: { type: import_genai.Type.STRING }
          },
          required: ["mealsPlanned", "groceryItems", "costEfficiencyScore", "mandiTip"]
        }
      }
    });
    res.json(JSON.parse(response.text || "{}"));
  } catch (error) {
    console.warn("Weekly Planner failure (using simulated fallback):", error.message || error);
    const errStr = error.message || String(error);
    const isQuota = errStr.includes("quota") || errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED");
    res.json({
      mealsPlanned: [
        { day: "Monday", breakfast: "Poha", lunch: "Dal Tadka & Rice", dinner: "Paneer Bhurji" },
        { day: "Tuesday", breakfast: "Idli Sambar", lunch: "Rasam Mudda Rice", dinner: "Alloo Gobhi" },
        { day: "Wednesday", breakfast: "Dhokla", lunch: "Khichdi Kadhi", dinner: "Methi Thepla" },
        { day: "Thursday", breakfast: "Aloo Parantha", lunch: "Mixed Vegetable Sabji", dinner: "Sambar Vada" },
        { day: "Friday", breakfast: "Upma", lunch: "Chole Bhature", dinner: "Bhindi Masala" },
        { day: "Saturday", breakfast: "Suji Halwa", lunch: "Kadhi Pakora", dinner: "Moong Dal Cheela" },
        { day: "Sunday", breakfast: "Paneer Parantha", lunch: "Veg Biryani & Tomato Rasam", dinner: "Jeera Aloo Roti" }
      ],
      groceryItems: [
        { name: "Tomato", quantityNeeded: "1.5 kg", estimatedPrice: 48, category: "Vegetable", reason: "For Rasam, gravy gravies and Sambar preparations" },
        { name: "Garlic", quantityNeeded: "250g", estimatedPrice: 41, category: "Spice", reason: "Mandi prices down by 8%, stock up now" },
        { name: "Wheat Atta", quantityNeeded: "5 kg", estimatedPrice: 220, category: "Grain", reason: "Weekly staple for rotis/paranthas" },
        { name: "Paneer", quantityNeeded: "400g", estimatedPrice: 144, category: "Dairy", reason: "High-protein balance to meet senior members needs" }
      ],
      costEfficiencyScore: 92,
      mandiTip: "Currently operating in offline-first mode. Onion and potato prices are stable in most domestic mandis. Opt for seasonal greens to save up to 15%.",
      isFallback: true,
      errorType: isQuota ? "QUOTA_EXHAUSTED" : "API_ERROR",
      errorMessage: errStr
    });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started running on http://127.0.0.1:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
