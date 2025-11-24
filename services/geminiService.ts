import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Era } from "../types";

// Helper to format the context string dynamically
export const generateLibraryContext = (collections: Era[]) => {
  let context = "你是一个精通湖南出土简牍的博物馆研究员助手。请根据以下资料库内容回答用户问题。如果问题超出资料库范围，请礼貌地说明。\n\n资料库内容：\n";
  
  collections.forEach(era => {
    // Era type has 'name' and 'categories'
    context += `\n【${era.name}】\n`;
    era.categories.forEach(item => {
      // CollectionCategory type has 'name', 'description' (optional), and 'articles'
      const desc = item.description ? ` (${item.description})` : '';
      context += `- ${item.name}${desc}: 收录文章 ${item.articles.length} 篇\n`;
    });
  });
  
  context += "\n请用专业、典雅、学术的中文回答，可以适当引用简牍学专业术语。";
  return context;
};

export const sendMessageToGemini = async (
  message: string,
  history: { role: 'user' | 'model'; text: string }[],
  contextData?: string // Accept dynamic context
): Promise<string> => {
  // Ensure API key is available
  if (!process.env.API_KEY) {
    return "请配置 API KEY 以使用 AI 助手功能。";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const systemInstruction = contextData || "你是一个简牍博物馆助手。";
    
    const prompt = `
      用户历史对话:
      ${history.map(h => `${h.role === 'user' ? '用户' : '助手'}: ${h.text}`).join('\n')}
      
      当前问题: ${message}
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response.text || "抱歉，我暂时无法回答这个问题。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "连接简牍知识库时发生错误，请稍后再试。";
  }
};