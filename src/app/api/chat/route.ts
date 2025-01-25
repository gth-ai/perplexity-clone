import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "sk-8b90c1895fc24c30af077f7bb54fd4e0",
  baseURL: "https://api.deepseek.com/v1",
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Filtrer les messages pour s'assurer qu'ils ont tous un rôle et un contenu valide
    const validMessages = messages.map((msg: any) => ({
      role: msg.role || "user",
      content: msg.content
    })).filter((msg: any) => msg.content && msg.content.trim() !== "");

    const response = await openai.chat.completions.create({
      model: "deepseek-reasoner",
      messages: validMessages,
      temperature: 0.7,
      max_tokens: 1000,
      // Désactiver le reasoning_content
      function_call: "none",
      // S'assurer que la réponse est bien formatée
      response_format: { type: "text" }
    });

    // Vérifier et formater la réponse
    const assistantMessage = {
      role: "assistant",
      content: response.choices[0]?.message?.content || "Je suis désolé, je n'ai pas pu générer une réponse."
    };

    return NextResponse.json(assistantMessage);
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { 
        role: "assistant", 
        content: "Désolé, une erreur s'est produite. Veuillez réessayer." 
      },
      { status: 500 }
    );
  }
} 