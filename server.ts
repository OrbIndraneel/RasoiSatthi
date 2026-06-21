import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Mock/Simulated Mandi Prices database
const INDIAN_MANDI_PRICES = [
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
  { ingredient: "Milk", basePrice: 64, currentPrice: 66, unit: "litre", trend: "stable", mandi: "Amul / Mother Dairy" },
];

// Curated Regionally Diverse Seed Indian Recipes
const SEED_RECIPES = [
  {
    id: "r1",
    title: {
      hi: "पनीर भुर्जी",
      en: "Paneer Bhurji",
      ta: "பன்னீர் புர்ஜி",
      te: "పన్నీర్ భుర్జీ",
      mr: "पनीर भुर्जी",
      bn: "পনির ভুর্জি",
      gu: "પનીર ભુરજી"
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
        "एक कड़ाही में तेल या मक्खन मध्यम आंच पर गर्म करें।",
        "जीरा और अदरक-लहसुन का पेस्ट डालकर कच्चा स्वाद जाने तक भूनें।",
        "कटे हुए प्याज और हरी मिर्च जोड़ें, और प्याज के पारदर्शी होने तक भूनें।",
        "कटे हुए टमाटर डालें और उनके नरम होने तक पकाएं।",
        "हल्दी, लाल मिर्च पाउडर, गरम मसाला और नमक डालकर अच्छी तरह मिलाएं।",
        "मसालों से तेल अलग होने पर मसला हुआ (crumbled) पनीर डालें।",
        "धीमी आंच पर 2 से 3 मिनट तक अच्छी तरह चलाते हुए पकाएं।",
        "ताजा कटी हुई धनिया पत्ती से सजाकर गरमागरम रोटी या परांठे के साथ परोसें।"
      ],
      en: [
        "Heat oil or butter in a pan over medium heat.",
        "Add cumin seeds and ginger-garlic paste; sauté until the raw aroma vanishes.",
        "Add chopped onions and green chillies, cooking until translucent.",
        "Mix in the chopped tomatoes and cook until they soften.",
        "Add turmeric powder, red chilli powder, garam masala, and salt. Mix well.",
        "Once oil separates from spices, add crumbled paneer.",
        "Cook on low heat for 2-3 minutes, stirring continuously to combine ingredients safely.",
        "Garnish with freshly chopped coriander leaves and serve hot with roti or paratha."
      ],
      ta: [
        "கடாயில் எண்ணெய் அல்லது வெண்ணெய் சூடாக்கவும்.",
        "சீரகம், இஞ்சி-பூண்டு விழுது சேர்த்து பச்சை வாசனை போகும்வரை வதக்கவும்.",
        "நறுக்கிய வெங்காயம், பச்சை மிளகாய் சேர்த்து வதக்கவும்.",
        "தக்காளி சேர்த்து குழைவாக வதக்கவும். மஞ்சள், மிளகாய் தூள், கரம் மசாலா, உப்பு சேர்க்கவும்.",
        "உதிர்த்த பன்னீர் சேர்த்து மிதமான தீயில் 2-3 நிமிடங்கள் கிளறி இறக்கவும். கொத்தமல்லி தூவி பரிமாறவும்."
      ],
      te: [
        "బాణలిలో నూనె లేదా వెన్న వేడి చేయండి.",
        "జీలకర్ర మరియు అల్లం-వెల్లుల్లి పేస్ట్ వేసి పచ్చివాసన పోయేవరకు వేయించాలి.",
        "ఉల్లిపాయ ముక్కలు, పచ్చిమిర్చి వేసి వేయించాలి. తరిగిన టమోటాలు వేసి మగ్గనివ్వాలి.",
        "మసాలాలు, ఉప్పు వేసి కలిపి, చిదిమిన పన్నీర్ జోడించాలి. 2-3 నిమిషాలు వేయించి కొత్తిమీరతో సర్వ్ చేయాలి."
      ],
      mr: [
        "कढईत तेल किंवा बटर गरम करा.",
        "जिरे आणि आले-लसूण पेस्ट घालून परता. मग कांदा आणि हिरवी मिरची मऊ होईपर्यंत परता.",
        "टोमॅटो घालून मऊ होईपर्यंत शिजवा. हळद, तिखट, गरम मसाला आणि मीठ घाला.",
        "चुरा केलेला पनीर घाला, २-३ मिनिटे मंद आचेवर हलवून शिजवा, कोथिंबीर घालून गरमागरम सर्व्ह करा."
      ],
      bn: [
        "কড়াইতে তেল বা মাখন মাঝারি আঁচে গরম করুন।",
        "জিরে ফোড়ন দিয়ে আদা-রসুন বাটা কষিয়ে নিন। পেঁয়াজ ও কাঁচালঙ্কা কুচি হালকা সোনালী করে ভাজুন।",
        "টমেটো কুচি দিন ও নরম হওয়া পর্যন্ত রান্না করুন। গুঁড়ো মশলা ও নুন মেশান।",
        "হাতে গুঁড়ো করে রাখা পনির যোগ করে ২-৩ মিনিট নাড়াচাড়া করুন। ধনেপাতা কুচি ছড়িয়ে গরম পরোটার সাথে পরিবেশন করুন।"
      ],
      gu: [
        "એક કડાઈમાં તેલ અથવા માખણ ગરમ કરો. જીરું અને આદુ-લસણની પેસ્ટ સાંતળો.",
        "ઝીણી સમારેલી ડુંગળી અને લીલા મરચા ઉમેરીને ડુંગળી ગુલાબી થાય ત્યાં સુધી સાંતળો.",
        "ટામેટા ઉમેરીને મિક્સ કરો, બધા મસાલા અને મીઠું ઉમેરી સાંતળો, મસળેલો પનીર ઉમેરી ૨-૩ મિનિટ ધીમા તાપે પાકવા દો."
      ]
    },
    prepTime: 15,
    tags: ["Vegetarian", "High Protein", "Quick Active", "North Indian"],
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "r2",
    title: {
      hi: "तमिल रसम",
      en: "Classic Tamil Rasam",
      ta: "தக்காளி பூண்டு ரசம்",
      te: "టమోటా వెల్లుల్లి రసం",
      mr: "तामिळ रसम",
      bn: "তামিল রসম",
      gu: "તમિલ રસમ"
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
        "काली मिर्च, जीरा और लहसुन को सिलबट्टे या ओखली में दरदरा कूट लें।",
        "एक बर्तन में इमली का रस, मसले हुए टमाटर, स्वादानुसार नमक और पानी मिलाएं।",
        "कढ़ाई में घी गर्म करें, फिर राई, सूखी लाल मिर्च, कढ़ी पत्ता और हींग का तड़का लगाएं।",
        "कुटा हुआ मसाला (लहसुन, जीरा, काली मिर्च) डालकर धीमी आंच पर ३० सेकंड भूनें।",
        "अब टमाटर और इमली का घोल कढ़ाई में डालें।",
        "इसे धीमी आंच पर गर्म होने दें। ध्यान रहे इसे ज्यादा खौलने नहीं देना है, जैसे ही इसमें झाग बनने लगे, आंच बंद कर दें।",
        "ऊपर से धनिया पत्ता छिड़कें और रसदार रसम को चावल के साथ परोसें।"
      ],
      ta: [
        "சீரகம், மிளகு, பூண்டு ஆகியவற்றை இடித்துக் கொள்ளவும்.",
        "புளித் தண்ணீர் மற்றும் தக்காளியை ஒன்றாக கரைத்து உப்பு சேர்த்து வைக்கவும்.",
        "தாளிக்க வேண்டிய பொருள்களை நெய்யில் தாளித்து, இடித்த மசாலாவை சேர்த்து வதக்கவும்.",
        "கரைத்து வைத்த சாற்றை ஊற்றி, நுரை கூடி வரும் போது அடுப்பை அணைத்து கொத்தமல்லி தூவவும்."
      ],
      te: [
        "మిరియాలు, జీలకర్ర, వెల్లుల్లిపాయలను దంచుకోండి.",
        "చింతపండు రసం, టమోటాలు ఒక గిన్నెలో బాగా కలిపి ఉప్పు వేయండి.",
        "తాలింపు వేసి దంచిన మసాలా వేయించండి, టమోటా చింతపండు మిశ్రమం పోసి మరిగించి నురగ రాగానే కొత్తిమీర వేసి దించేయాలి."
      ],
      mr: [
        "जिरे, मिरी आणि लसूण रफली कुटून घ्या.",
        "चिंच कोळून त्यात टोमॅटो मॅश करून घ्या, मीठ आणि पाणी घाला.",
        "तव्यावर तूप गरम करून मोहरी, कढीपत्ता, हिंग फोडणी द्या. कुटलेले मसाले घाला आणि ३० सेकंद परतून चिंचेचा रस घालून उकळी येण्यापूर्वी बंद करा."
      ],
      bn: [
        "গোলমরিচ, জিরে ও রসুন থেঁতো করে নিন।",
        "একটি পাত্রে তেঁতুলের জল, চটকানো টমেটো ও জল একসাথে মেশান। নুন দিন।",
        "ঘি গরম করে সর্ষে, শুকনো লঙ্কা, কারিপাতা ও হিং ফোড়ন দিন। থেঁতো মশলা দিয়ে কষান।",
        "তেঁতুল টমেটোর মিশ্রণটি ঢেলে দিন। যখন চারপাশ ফুটতে শুরু করবে, তখন আঁচ বন্ধ করে দিন ও ধনেপাতা ছড়িয়ে দিন।"
      ],
      gu: [
        "જીરું, કાળા મરી અને લસણ અધકચરા વાટી લો.",
        "એક વાસણમાં આમલીનો રસ, ટામેટા અને પાણી મિક્સ કરો.",
        "ઘી ગરમ કરી રાય, કઢી પત્તા અને હિંગનો વઘાર કરી વાટેલો મસાલો ઉમેરી આમલી ટામેટાનું મિશ્રણ ઉમેરો, ઉભરો આવે એટલે ગેસ બંધ કરો."
      ]
    },
    prepTime: 10,
    tags: ["Vegetarian", "Gluten Free", "Tangy & Healing", "South Indian"],
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "r3",
    title: {
      hi: "गुजराती खमन ढोकला",
      en: "Gujarati Khaman Dhokla",
      ta: "குஜராத்தி கமன் தோக்ளா",
      te: "ఖమన్ డోక్లా",
      mr: "खमन ढोकळा",
      bn: "খামান ঢোকলা",
      gu: "ખમણ ઢોકળા"
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
        "बेसन, सूजी, पानी, नींबू रस, अदरक-मिर्च पेस्ट, चीनी और नमक मिलाकर चिकना घोल तैयार कर लें।",
        "धोकला पकाने वाले स्टीमर को गर्म करें और एक बर्तन में थोड़ा तेल लगाकर चिकना करें।",
        "घोल में ईनो फ्रूट साल्ट डालकर जल्दी-जल्दी एक ही दिशा में फेंटें। घोल एकदम फूल जाएगा।",
        "इसे तुरंत चिकने बर्तन में डालकर स्टीमर में १५ मिनट के लिए भाप पर पकाएं।",
        "तड़के के लिए: एक छोटी कढ़ाई में तेल गर्म करें, राई, हरी मिर्च, कढ़ी पत्ता और हींग डालें।",
        "तड़के में लगभग आधा कप पानी और थोड़ी चीनी डालकर आंच तेज करें जब तक चीनी घुल न जाए।",
        "ढोकला को चौकोर काटकर उस पर तड़के वाला पानी चारों तरफ बराबर फैला दें।",
        "कटे धनिया और कद्दूकस नारियल से सजाकर आनंद लें।"
      ],
      ta: [
        "கடலை மாவு, ரவை, எலுமிச்சை சாறு, இஞ்சி மிளகாய் விழுது, சர்க்கரை சேர்த்து மாவு கரைத்துக் கொள்ளவும்.",
        "ஈனோ சேர்த்து உடனே தட்டில் ஊற்றி 15 நிமிடங்கள் ஆவியில் வேக வைக்கவும்.",
        "எண்ணெயில் கடுகு, கறிவேப்பிலை, பச்சை மிளகாய் தாளித்து, தண்ணீர் மற்றும் சர்க்கரை சேர்த்து கொதிக்க வைத்து வெந்த தோக்ளா மேல் ஊற்றவும்."
      ],
      te: [
        "శనగపిండి, రవ్వ, నిమ్మరసం, అల్లం మిర్చి పేస్ట్, పంచదార వేసి నీటితో జారుగా కలుపుకోండి.",
        "ఈనో సాల్ట్ వేసి కలిపి, పాత్రకు నూనె రాసి పిండిని పోసి 15 నిమిషాలు ఆవిరిపై ఉడికించాలి.",
        "పోపు వేసి అందులో కొద్దిగా నీరు, పంచదార వేసి మరిగించి, ఉడికిన డోక్లా ముక్కలపై చల్లాలి."
      ],
      mr: [
        "बेसन, सुजी, लिंबाचा रस, आले-मिरची पेस्ट आणि पाणी एकत्र फेटून घ्या. स्टीमर तयार ठेवा.",
        "मिश्रणात इनो घालून व्यवस्थित हलवा, तेल लावलेल्या भांड्यात लगेच ओतून १५ मिनिटे वाफवून घ्या.",
        "फोळणीसाठी तेल गरम करून मोहरी, कढीपत्ता, बारीक चिरलेली मिरची घाला, थोडे त्यात पाणी व साखर घालून ते गरम फोडणीचे पाणी ढोकळ्यावर सर्वत्र पसरा."
      ],
      bn: [
        "বেসন, সুজি, লেবুর রস, আদা-লঙ্কার পেস্ট, চিনি ও নুন মিশিয়ে জল দিয়ে ব্যাটার বানান।",
        "ব্যাটারে ইনো দিয়ে দ্রুত ফুটিয়ে নিন। গ্রিজ করা পাত্রে ব্যাটার ঢেলে ১৫ মিনিট ভাপিয়ে নিন।",
        "ফোড়নের জন্য কড়াইতে সর্ষে, কারিপাতা ও কাঁচালঙ্কা ভাজুন। সামান্য জল ও চিনি দিয়ে ফুটিয়ে নিন।",
        "ঢোকলা কেটে ওপর থেকে মিষ্টি ফোড়নের জল ছড়িয়ে পরিবেশন করুন।"
      ],
      gu: [
        "બેસન, સોજી, ખાંડ, આદુ મરચાની પેસ્ટ, લીંબુનો રસ અને મીઠું ઉમેરી બેટર બનાવો.",
        "તેમાં ઈનો ઉમેરીને બરાબર હલાવો, ગ્રીસ કરેલી થાળીમાં બેટર રેડીને ૧૫ મિનિટ માટે સ્ટીમ કરો.",
        "વઘાર માટે તેલમાં રાઈ, લીલા મરચા અને ખાંડનું પાણી ઉકાળી સરખા પ્રમાણમાં ઢોકળા પર રેડો, કોથમીરથી સજાવો."
      ]
    },
    prepTime: 25,
    tags: ["Vegetarian", "Steamed", "Gujarati Special", "Low Calorie"],
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=60"
  }
];

// Lazy Gemini instance safely initiated
let geminiAI: GoogleGenAI | null = null;
function getGemini() {
  if (!geminiAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined. Falling back to Mock Gemini responses.");
      return null;
    }
    geminiAI = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return geminiAI;
}

// ------------------- API ROUTES -------------------

// 1. Live Mandi Prices
app.get("/api/mandi-prices", (req, res) => {
  res.json({ prices: INDIAN_MANDI_PRICES });
});

// 2. Scan Vegetables via Image (Base64) - Live server-side Gemini integration
app.post("/api/gemini/scan-vegetables", async (req, res) => {
  const { image } = req.body; // base64 string
  
  if (!image) {
    return res.status(400).json({ error: "Missing image base64 data" });
  }

  const ai = getGemini();

  if (!ai) {
    // Elegant realistic mock if there is no API Key configured
    return res.json({
      success: true,
      simulated: true,
      items: [
        { name: "Tomato", quantity: 500, unit: "g", category: "Vegetable", confidence: 0.95, freshRating: 88, expiryDays: 6, bbox: [20, 30, 45, 60] },
        { name: "Onion", quantity: 1000, unit: "g", category: "Vegetable", confidence: 0.92, freshRating: 95, expiryDays: 14, bbox: [50, 10, 80, 45] },
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
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              description: "List of identified kitchen items from image.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  quantity: { type: Type.INTEGER },
                  unit: { type: Type.STRING },
                  category: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  freshRating: { type: Type.INTEGER },
                  expiryDays: { type: Type.INTEGER }
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
    // Add mocked/simulated bounding box locations on our photo frame for maximum visual client UI rendering!
    const itemsWithBbox = (parsedData.items || []).map((item: any, idx: number) => {
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

  } catch (error: any) {
    console.warn("Gemini Scan Error (using simulated fallback):", error.message || error);
    res.json({
      success: true,
      simulated: true,
      items: [
        { name: "Tomato", quantity: 500, unit: "g", category: "Vegetable", confidence: 0.95, freshRating: 88, expiryDays: 6, bbox: [20, 30, 45, 60] },
        { name: "Onion", quantity: 1000, unit: "g", category: "Vegetable", confidence: 0.92, freshRating: 95, expiryDays: 14, bbox: [50, 10, 80, 45] },
        { name: "Green Chilli", quantity: 100, unit: "g", category: "Spice", confidence: 0.89, freshRating: 90, expiryDays: 8, bbox: [75, 50, 95, 80] }
      ]
    });
  }
});

// 3. Indian Voice / Code-switched query router
app.post("/api/gemini/voice-query", async (req, res) => {
  const { query, language, familyProfile, pantry } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Missing query text" });
  }

  const ai = getGemini();

  const systemInstruction = `
    You are 'RasoiSaathi', an intuitive, native Indian AI kitchen assistant.
    You respond elegantly in code-switched multi-lingual Indian styles (using words like 'Aap', 'Beta', 'Tiffin', 'Ghar ka swad').
    The user's query may be in Hinglish, English, or localized Indian scripts (${language || 'en'}).
    And you operate based on this kitchen state:
    Current Pantry inventory: ${JSON.stringify(pantry || [])}
    Family Dietary/Allergy Profiles: ${JSON.stringify(familyProfile || {})}
    
    Respond in raw JSON matching the following structure:
    {
      "intent": "RECIPE_SEARCH" | "SUBSTITUTE_FINDER" | "EXPIRY_CHECK" | "PREFERENCE_UPDATE" | "GENERAL_ASSIST",
      "voiceResponse": "Warm verbal greeting response here, conversational, helpful, brief (max 3 sentences)",
      "markdownDetail": "Detailed markdown explanation or recipes with ingredients, substitute table, safety notices, and tips in ${language || 'en'}",
      "suggestedAction": string (e.g. "cook_bhurji", "view_pantry"),
      "suggestedRecipes": Array<any>
    }
  `;

  if (!ai) {
    // High-fidelity fallback
    const simulatedResponse = {
      intent: query.toLowerCase().includes("substitute") ? "SUBSTITUTE_FINDER" : "RECIPE_SEARCH",
      voiceResponse: `Arre wah! Suna aapne paneer aur shimla mirch ke baare mein pucha. Main aapko jhatpat Paneer Tikka ya Shimla Mirch Paneer banakar dila sakti hoon!`,
      markdownDetail: `### 🍲 RasoiSaathi Smart Recommendations

Humare paas pantry me fresh **Paneer** aur **Shimla Mirch (Capsicum)** hai. Yeh rahi jhatpat recipe:

#### **Kadhai Shimla-Paneer (Low-Oil)**
- **Prep Time:** 15 mins | **Servings:** 2
- **Nutrition:** High Protein, Diabetic Friendly

| Ingredient | Quantity | Status |
|---|---|---|
| Paneer | 200g | Available ✅ |
| Onion / Tomato | 1 each | Available ✅ |
| Capsicum (Shimla Mirch) | 1 cup | Available ✅ |
| Garam Masala | 1 tsp | Spice Box ✅ |

*Tip:* Agar tamatar kam hain, to dahi ya nimbu ka ras use kar sakte hain! Jaaniye aur options.`,
      suggestedAction: "cook_paneer",
      suggestedRecipes: [SEED_RECIPES[0]]
    };
    return res.json(simulatedResponse);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Query: "${query}" in target language: "${language || 'en'}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: { type: Type.STRING },
            voiceResponse: { type: Type.STRING },
            markdownDetail: { type: Type.STRING },
            suggestedAction: { type: Type.STRING },
            suggestedRecipes: {
              type: Type.ARRAY,
              items: { type: Type.OBJECT }
            }
          },
          required: ["intent", "voiceResponse", "markdownDetail", "suggestedAction"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));

  } catch (error: any) {
    console.warn("Gemini Voice Router error (using simulated fallback):", error.message || error);
    const simulatedResponse = {
      intent: query.toLowerCase().includes("substitute") ? "SUBSTITUTE_FINDER" : "RECIPE_SEARCH",
      voiceResponse: `Arre wah! Mainne aapka swaal suna: "${query}". Abhi hum offline support use kar rahe hain, par main aapko humari recipe suggest kar sakti hoon!`,
      markdownDetail: `### 🍲 RasoiSaathi Smart Recommendations (Resilient Mode)
      
Humare paas pantry me fresh **Paneer** aur **Shimla Mirch (Capsicum)** hai. Yeh rahi jhatpat recipe:

#### **Kadhai Shimla-Paneer (Low-Oil)**
- **Prep Time:** 15 mins | **Servings:** 2
- **Nutrition:** High Protein, Diabetic Friendly

| Ingredient | Quantity | Status |
|---|---|---|
| Paneer | 200g | Available ✅ |
| Onion / Tomato | 1 each | Available ✅ |
| Capsicum (Shimla Mirch) | 1 cup | Available ✅ |
| Garam Masala | 1 tsp | Spice Box ✅ |

*Tip:* It looks like you asked: "${query}". If you need specific substitutes, remember that you can substitute cream with thick curd or fresh malai!`,
      suggestedAction: "cook_paneer",
      suggestedRecipes: [SEED_RECIPES[0]]
    };
    res.json(simulatedResponse);
  }
});

// 4. Recipe Suggestion Engine (RAG)
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
          type: Type.OBJECT,
          properties: {
            explanation: { type: Type.STRING },
            curatedRecipes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: {
                    type: Type.OBJECT,
                    properties: {
                      hi: { type: Type.STRING },
                      en: { type: Type.STRING },
                      ta: { type: Type.STRING },
                      te: { type: Type.STRING },
                      mr: { type: Type.STRING },
                      bn: { type: Type.STRING },
                      gu: { type: Type.STRING }
                    }
                  },
                  prepTime: { type: Type.INTEGER },
                  tags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  ingredients: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        amount: { type: Type.STRING }
                      }
                    }
                  },
                  instructions: {
                    type: Type.OBJECT,
                    properties: {
                      hi: { type: Type.ARRAY, items: { type: Type.STRING } },
                      en: { type: Type.ARRAY, items: { type: Type.STRING } },
                      ta: { type: Type.ARRAY, items: { type: Type.STRING } },
                      te: { type: Type.ARRAY, items: { type: Type.STRING } },
                      mr: { type: Type.ARRAY, items: { type: Type.STRING } },
                      bn: { type: Type.ARRAY, items: { type: Type.STRING } },
                      gu: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                  },
                  imageUrl: { type: Type.STRING }
                }
              }
            }
          },
          required: ["explanation", "curatedRecipes"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));

  } catch (error: any) {
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

// 5. Intelligent Weekly Meal Planner and Grocery Optimizer
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
          type: Type.OBJECT,
          properties: {
            mealsPlanned: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  breakfast: { type: Type.STRING },
                  lunch: { type: Type.STRING },
                  dinner: { type: Type.STRING }
                }
              }
            },
            groceryItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  quantityNeeded: { type: Type.STRING },
                  estimatedPrice: { type: Type.INTEGER },
                  category: { type: Type.STRING },
                  reason: { type: Type.STRING }
                }
              }
            },
            costEfficiencyScore: { type: Type.INTEGER },
            mandiTip: { type: Type.STRING }
          },
          required: ["mealsPlanned", "groceryItems", "costEfficiencyScore", "mandiTip"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));

  } catch (error: any) {
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

// Vite full-stack middleware serving
async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started running on http://127.0.0.1:${PORT}`);
  });
}

startServer();
