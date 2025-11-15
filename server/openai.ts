import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required");
}

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ProductAnalysisInput {
  productName: string;
  productPrice?: string;
  platform: string;
  reviewsSummary?: string;
  productDescription?: string;
}

interface ProductAnalysisResult {
  trustScore: number; // 0-100
  trustLevel: "trusted" | "warning" | "untrusted";
  positivePoints: string[];
  negativePoints: string[];
  recommendation: string;
  aiAnalysis: string;
  alternatives?: {
    name: string;
    url: string;
    price: string;
    trustScore: number;
    savings: string;
    highlights: string[];
  }[];
}

export async function analyzeProduct(
  input: ProductAnalysisInput
): Promise<ProductAnalysisResult> {
  try {
    const prompt = `أنت خبير في تحليل المنتجات والتقييمات. قم بتحليل المنتج التالي وأعطني تقرير مفصل بالعربية.

المنتج: ${input.productName}
السعر: ${input.productPrice || "غير متوفر"}
المنصة: ${input.platform}
${input.productDescription ? `الوصف: ${input.productDescription}` : ""}
${input.reviewsSummary ? `ملخص التقييمات: ${input.reviewsSummary}` : ""}

يرجى تقديم التحليل بالتنسيق JSON التالي بالضبط:
{
  "trustScore": رقم من 0 إلى 100,
  "trustLevel": "trusted" أو "warning" أو "untrusted",
  "positivePoints": [قائمة بـ3-5 نقاط إيجابية بالعربية],
  "negativePoints": [قائمة بـ2-4 نقاط سلبية أو تحذيرات بالعربية],
  "recommendation": "توصية واضحة للمستخدم بالعربية",
  "aiAnalysis": "تحليل مفصل للمنتج بالعربية"
}

ملاحظات:
- استخدم العربية في كل الحقول
- trustScore يجب أن يكون رقم صحيح بين 0 و 100
- trustLevel: "trusted" إذا كان النقاط >= 80، "warning" إذا >= 50، "untrusted" إذا < 50
- كن موضوعي ومفيد
- ركز على التقييمات والمصداقية`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content:
            "أنت خبير في تحليل المنتجات والتقييمات. تقدم تحليلات موضوعية ومفيدة باللغة العربية. استخدم JSON فقط في الرد.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    // Generate mock alternatives based on trust score
    let alternatives: ProductAnalysisResult["alternatives"] = [];
    if (result.trustScore < 80) {
      alternatives = generateMockAlternatives(input);
    }

    return {
      trustScore: Math.max(0, Math.min(100, Math.round(result.trustScore))),
      trustLevel: result.trustLevel || getTrustLevel(result.trustScore),
      positivePoints: result.positivePoints || [],
      negativePoints: result.negativePoints || [],
      recommendation:
        result.recommendation || "يرجى مراجعة التفاصيل قبل الشراء",
      aiAnalysis: result.aiAnalysis || "تحليل المنتج غير متوفر",
      alternatives,
    };
  } catch (error) {
    console.error("OpenAI Analysis Error:", error);
    throw new Error("Failed to analyze product with AI");
  }
}

function getTrustLevel(score: number): "trusted" | "warning" | "untrusted" {
  if (score >= 80) return "trusted";
  if (score >= 50) return "warning";
  return "untrusted";
}

function generateMockAlternatives(input: ProductAnalysisInput) {
  // Generate 3 better alternatives
  const priceNum = parseFloat(
    input.productPrice?.replace(/[^0-9.]/g, "") || "0"
  );

  return [
    {
      name: `${input.productName} - نسخة محسّنة`,
      url: "#",
      price: priceNum > 0 ? `$${(priceNum * 0.9).toFixed(2)}` : "$29.99",
      trustScore: 85,
      savings: priceNum > 0 ? `$${(priceNum * 0.1).toFixed(2)}` : "$5",
      highlights: [
        "تقييمات أعلى من المستخدمين",
        "ضمان أطول",
        "شحن مجاني",
      ],
    },
    {
      name: `بديل موثوق من ${input.platform}`,
      url: "#",
      price: priceNum > 0 ? `$${(priceNum * 0.85).toFixed(2)}` : "$27.99",
      trustScore: 88,
      savings: priceNum > 0 ? `$${(priceNum * 0.15).toFixed(2)}` : "$7",
      highlights: [
        "جودة ممتازة حسب المراجعات",
        "سعر أفضل",
        "بائع موثوق",
        "إرجاع مجاني",
      ],
    },
    {
      name: `${input.productName} Pro`,
      url: "#",
      price: priceNum > 0 ? `$${(priceNum * 1.1).toFixed(2)}` : "$34.99",
      trustScore: 92,
      savings: "ميزات إضافية",
      highlights: [
        "نسخة محسنة",
        "ميزات إضافية",
        "ضمان ممتد",
        "تقييمات ممتازة",
      ],
    },
  ];
}

// Mock web scraping function (will be replaced with real scraping)
export async function scrapeProductData(url: string, platform: string) {
  // In a real implementation, this would scrape the actual product page
  // For now, return mock data
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

  return {
    productName: "منتج تجريبي - " + platform,
    productPrice: "$29.99",
    productImage: "https://placehold.co/400x400/3B82F6/FFFFFF/png?text=Product",
    reviewsSummary: "تقييم عام 4.3 من 5 نجوم، مع 2,341 مراجعة",
    productDescription: "منتج ذو جودة جيدة مع مراجعات إيجابية بشكل عام",
  };
}
