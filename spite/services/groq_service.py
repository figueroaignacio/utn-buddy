import json
import time

from groq import Groq

from spite.core.config import get_settings

settings = get_settings()

SCORING_PROMPT = """
You are a senior software engineer reviewing a job posting. Be direct and honest.
The user is specifically searching for: "{query}".
If the job does NOT align with this query (e.g. wrong tech stack or completely wrong role), severely penalize the score.

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


class GroqService:
    def __init__(self) -> None:
        self.client = Groq(api_key=settings.groq_api_key)
        self.model = "llama-3.3-70b-versatile"

    def score_job(
        self,
        query: str,
        title: str,
        company: str,
        description: str,
        location: str | None = None,
        salary: str | None = None,
    ) -> dict:
        prompt = SCORING_PROMPT.format(
            query=query,
            title=title,
            company=company,
            location=location or "Not specified",
            salary=salary or "Not disclosed",
            description=description or "No description provided.",
        )

        max_retries = 3
        base_delay = 10

        for attempt in range(max_retries):
            try:
                response = self.client.chat.completions.create(
                    messages=[
                        {
                            "role": "user",
                            "content": prompt,
                        }
                    ],
                    model=self.model,
                )
                raw = response.choices[0].message.content.strip()
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
                if "429" in error_str or "rate_limit" in error_str.lower():
                    if attempt < max_retries - 1:
                        time.sleep(base_delay * (2**attempt))
                        continue
                    else:
                        summary = "Rate limit hit — AI is taking a break. Try again in a minute."
                elif "API_KEY" in error_str or "401" in error_str:
                    summary = "Invalid API key."
                    break
                else:
                    summary = "AI scoring failed."
                    break

        return {"score": 0.0, "summary": summary}


groq_service = GroqService()
