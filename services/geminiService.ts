import { GoogleGenAI } from "@google/genai";

type PromptKey = "visaoGeral" | "analiseRisco" | "relatorio" | "previsao";

const sanitizeKey = (raw: string | undefined | null): string | undefined => {
  const trimmed = raw?.trim();
  return trimmed ? trimmed : undefined;
};

const resolveApiKey = (): string | undefined => {
  const importMetaEnv =
    typeof import.meta !== "undefined"
      ? (import.meta as ImportMeta & {
          env?: Record<string, unknown>;
        }).env
      : undefined;

  const fromImportMeta = importMetaEnv
    ? sanitizeKey(
        (importMetaEnv["VITE_GEMINI_API_KEY"] as string | undefined) ??
          (importMetaEnv["GEMINI_API_KEY"] as string | undefined) ??
          (importMetaEnv["GOOGLE_API_KEY"] as string | undefined)
      )
    : undefined;

  if (fromImportMeta) {
    return fromImportMeta;
  }

  if (typeof process !== "undefined" && process.env) {
    return sanitizeKey(
      process.env.VITE_GEMINI_API_KEY ??
        process.env.GEMINI_API_KEY ??
        process.env.GOOGLE_API_KEY ??
        process.env.API_KEY
    );
  }

  return undefined;
};

const apiKey = resolveApiKey();

const createClient = (key: string | undefined): GoogleGenAI | null => {
  if (!key) {
    console.warn(
      "Gemini API key is not configured. Falling back to mock insights."
    );
    return null;
  }

  try {
    return new GoogleGenAI({ apiKey: key });
  } catch (error) {
    console.error("Failed to initialise GoogleGenAI client", error);
    return null;
  }
};

const ai = createClient(apiKey);

const PROMPTS: Record<PromptKey, string> = {
  visaoGeral:
    "Analise os seguintes dados de bem-estar de funcionários e gere um insight conciso (2-3 frases) sobre a saúde geral da organização. Destaque uma tendência positiva e uma área de preocupação. Dados: FitScore médio global caiu 6% na última semana, frequência de check-ins no setor industrial diminuiu, empresas de tecnologia mostram aumento de 10% no engajamento.",
  analiseRisco:
    "Com base nestes dados, gere um insight de análise de risco com uma recomendação acionável (2-3 frases). Dados: O setor de vendas da empresa VitalTech apresenta um padrão de estresse crescente há 3 semanas, correlacionado com uma média de sono inferior a 6 horas.",
  relatorio:
    "Gere um resumo executivo (2-3 frases) para um relatório de bem-estar de Outubro. Destaque a principal diferença entre setores e a causa. Dados: Média de energia em tecnologia foi 22% superior à média geral. Principal fator de queda nas indústrias foi o aumento do estresse. Hidratação estável.",
  previsao:
    "Crie um alerta preditivo conciso (2-3 frases) com uma sugestão de mitigação. Dados: Probabilidade de 72% de queda no engajamento para empresas de logística nos próximos 30 dias.",
};

const MOCK_INSIGHTS: Record<PromptKey, string> = {
  visaoGeral:
    "O FitScore médio global caiu 6% em relação à última semana, impulsionado por uma queda na frequência de check-ins no setor industrial. Empresas de tecnologia, por outro lado, mostram um aumento de 10% no engajamento.",
  analiseRisco:
    "O setor de vendas da empresa VitalTech apresenta um padrão de estresse crescente há 3 semanas, correlacionado com uma média de sono inferior a 6 horas. Recomenda-se uma campanha de conscientização sobre higiene do sono para este grupo.",
  relatorio:
    "Durante o mês de outubro, a média de energia dos colaboradores das empresas de tecnologia foi 22% superior à média geral. O principal fator de queda nas empresas industriais foi o aumento do estresse em períodos de alta demanda. A hidratação se manteve estável em todos os setores.",
  previsao:
    "Com base nos dados atuais, há uma probabilidade de 72% de queda no engajamento para empresas de logística nos próximos 30 dias. Ações proativas, como desafios gamificados, podem mitigar este risco.",
};

export const geminiService = {
  async generateInsight(promptKey: PromptKey): Promise<string> {
    if (!ai) {
      return MOCK_INSIGHTS[promptKey];
    }

    const prompt = PROMPTS[promptKey];
    if (!prompt) {
      console.error(`Prompt key not found: ${promptKey}`);
      return "Insight indisponível no momento.";
    }

    try {
      console.log(`Generating insight for: ${promptKey}`);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });
      return response.text ?? MOCK_INSIGHTS[promptKey];
    } catch (error) {
      console.error("Error generating insight from Gemini API:", error);
      return (
        MOCK_INSIGHTS[promptKey] ||
        "Não foi possível gerar o insight. Verifique a conexão ou a configuração da API e tente novamente."
      );
    }
  },
};
