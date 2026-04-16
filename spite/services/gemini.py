import json
from google import genai
from spite.core.config import get_settings

settings = get_settings()

SCORING_PROMPT = """
You are a senior software engineer reviewing a job posting. Be direct and honest.
Summarize this job in ONE sentence. Mention what the role is, if the salary is disclosed,
and one notable thing (good or bad) about the posting. No corporate speak, no drama.

Title: {title}
Company: {company}
Location: {location}
Salary: {salary}
Description: {description}

Respond ONLY with valid JSON:
{{
    "score": <number between 0.0 and 10.0>,
    "summary": "<one clear, honest sentence about this job>"
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
            salary=salary or "Not disclosed",
            description=description or "No description provided.",
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
            result["score"] = max(0.0, min(10.0, float(result.get("score", 5.0))))
            return result

        except json.JSONDecodeError:
            return {"score": 5.0, "summary": "Could not parse AI response."}
        except Exception as e:
            error_str = str(e)
            if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                summary = "Rate limit hit — AI is taking a break. Try again in a minute."
            elif "API_KEY" in error_str or "401" in error_str:
                summary = "Invalid API key."
            else:
                summary = "AI scoring failed."
            return {"score": 0.0, "summary": summary}


gemini_service = GeminiService()
