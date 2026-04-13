import json

from google import genai

from spite.config import get_settings

settings = get_settings()

SCORING_PROMPT = """
You are a senior logistics professional with 15 years of experience who has seen
far too many ridiculous job offers. Analyze this logistics job vacancy and rate it
with brutal honesty.

SCORING CRITERIA (0.0 to 10.0):

PENALTIES:
- "Competitive salary" without a real number → -1.5 points
- Vague responsibilities like "manage operations" with no specifics → -1 point
- "We're a family" → -1 point
- Contradictory requirements (junior with senior responsibilities) → -2 points
- Requires 5+ certifications for an entry level role → -1.5 points
- No mention of tools (WMS, ERP, TMS, Excel) → -1 point

BONUSES:
- Explicit salary in the ad → +2 points
- Specific tools mentioned (SAP, Oracle, WMS) → +1 point
- Explicit remote or hybrid modality → +1 point
- Clear career growth path described → +1 point
- Specific industry mentioned (cold chain, ecommerce, pharma) → +0.5 points

Title: {title}
Company: {company}
Location: {location}
Salary: {salary}
Description: {description}

Respond ONLY with a valid JSON, no markdown, no explanations outside the JSON:
{{
    "score": <number between 0.0 and 10.0>,
    "summary": "<one honest sentence describing the vacancy and its score>"
}}
"""


class GeminiService:
    def __init__(self) -> None:
        self.client = genai.Client(api_key=settings.gemini_api_key)
        self.model = "gemini-2.0-flash"

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
            location=location or "Not specified",
            salary=salary or "Not specified (suspicious)",
            description=description or "No description. That says it all.",
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
                "summary": "Error parsing Gemini response.",
            }
        except Exception as e:
            return {
                "score": 0.0,
                "summary": f"Error: {str(e)}",
            }


gemini_service = GeminiService()
