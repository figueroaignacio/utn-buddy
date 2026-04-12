import json

from google import genai

from spite.config import get_settings

settings = get_settings()

SCORING_PROMPT = """
Eres un senior developer con 15 años de experiencia que ha visto demasiadas
ofertas de trabajo ridículas. Tu trabajo es analizar vacantes y puntuarlas
con honestidad brutal.

CRITERIOS DE PUNTUACIÓN (0.0 a 10.0):

PENALIZACIONES (bajan el score):
- "Startup environment" sin mencionar compensación → -2 puntos
- Más de 3 tecnologías requeridas para un rol junior → -1.5 puntos
- "Rockstar", "ninja", "evangelist" en el título → -2 puntos
- "Competitive salary" sin número real → -1.5 puntos
- 5+ años de experiencia para tecnologías con menos de 5 años de existencia → -3 puntos
- "We're a family" → -1 punto
- Requisitos contradictorios (junior con responsabilidades senior) → -2 puntos
- Stack de 10+ tecnologías requeridas → -1.5 puntos

BONIFICACIONES (suben el score):
- Salario explícito en el anuncio → +2 puntos
- Stack técnico claro y razonable → +1 punto
- Descripción honesta de responsabilidades → +1 punto
- Modalidad remota explícita → +1 punto
- Proceso de selección descripto → +1 punto

ANÁLISIS:
Título: {title}
Empresa: {company}
Ubicación: {location}
Salario: {salary}
Descripción: {description}

Respondé ÚNICAMENTE con un JSON válido, sin markdown, sin explicaciones fuera del JSON:
{{
    "score": <número entre 0.0 y 10.0>,
    "summary": "<una línea describiendo la vacante honestamente>",
    "red_flags": ["<flag 1>", "<flag 2>"],
    "green_flags": ["<flag 1>", "<flag 2>"],
    "reasoning": "<2-3 oraciones explicando el score con cinismo constructivo>"
}}
"""


class GeminiService:
    def __init__(self) -> None:
        self.client = genai.Client(api_key=settings.gemini_api_key)
        self.model = "gemini-2.5-flash"

    def score_job(
        self,
        title: str,
        company: str,
        description: str,
        location: str | None = None,
        salary: str | None = None,
    ) -> dict:
        prompt = SCORING_PROMPT.format(
            title=title,
            company=company,
            location=location or "No especificada",
            salary=salary or "No especificado (sospechoso)",
            description=description or "No hay descripción. Ya eso dice todo.",
        )

        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
            )
            raw = response.text.strip()

            if raw.startswith("```"):
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]

            result = json.loads(raw)
            result["score"] = max(0.0, min(10.0, float(result["score"])))
            return result

        except json.JSONDecodeError:
            return {
                "score": 5.0,
                "summary": "Error al parsear respuesta de Gemini.",
                "red_flags": ["La IA tuvo un mal día"],
                "green_flags": [],
                "reasoning": "No se pudo analizar la vacante correctamente.",
            }
        except Exception as e:
            return {
                "score": 0.0,
                "summary": f"Error: {str(e)}",
                "red_flags": ["Error de conexión con Gemini"],
                "green_flags": [],
                "reasoning": "Algo salió mal. Revisá tu API key.",
            }


gemini_service = GeminiService()
