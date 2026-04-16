import httpx
import typer
from rich.console import Group
from rich.panel import Panel
from rich.text import Text

from spite.cli.commands import API_BASE, console


def list_jobs(
    min_score: float = typer.Option(
        0.0, "--min-score", "-s", help="Minimum Gemini score"
    ),
    platform: str = typer.Option(None, "--platform", "-p", help="Filter by platform"),
    limit: int = typer.Option(50, "--limit", "-n", help="Max results"),
) -> None:
    """List saved jobs. Sorted by score, best first."""
    try:
        params: dict = {"limit": limit}
        if min_score > 0.0:
            params["min_score"] = min_score
        if platform:
            params["platform"] = platform
        response = httpx.get(f"{API_BASE}/jobs/", params=params)
        response.raise_for_status()
        jobs = response.json()
    except httpx.ConnectError:
        console.print("[red]API is not running.[/red]")
        raise typer.Exit(1)

    if not jobs:
        console.print("[dim]No jobs found.[/dim]")
        return

    console.print(f"\n[dim]{len(jobs)} jobs[/dim]\n")

    for job in jobs:
        summary = (job.get("score_summary") or "No summary available.")[:120]
        content = Text()
        content.append(f"{job['company']}", style="dim")
        content.append(f"\n\n{summary}\n\n", style="white")
        content.append(job["url"], style="dim underline")
        console.print(
            Panel(
                content,
                title=f"[bold]#{job['id']}  {job['title']}[/bold]",
                title_align="left",
                border_style="dim",
                padding=(1, 2),
            )
        )
        console.print()


def inspect(
    job_id: int = typer.Argument(..., help="Job ID to inspect"),
) -> None:
    """Show full details of a job, including Gemini's verdict."""
    try:
        response = httpx.get(f"{API_BASE}/jobs/{job_id}")
        if response.status_code == 404:
            console.print(f"[red]Job {job_id} not found.[/red]")
            raise typer.Exit(1)
        response.raise_for_status()
        job = response.json()
    except httpx.ConnectError:
        console.print("[red]API is not running.[/red]")
        raise typer.Exit(1)

    score = job.get("score")
    score_color = (
        "green" if score and score >= 7 else "yellow" if score and score >= 4 else "red"
    )

    console.print(
        Panel(
            Group(
                Text(job["title"], style="bold white"),
                Text(f"{job['company']} • {job.get('location') or 'N/A'}", style="dim"),
                Text(job["url"], style="dim underline"),
            ),
            title=f"Detailed Report #{job_id}",
            border_style=score_color,
        )
    )

    if score is not None:
        summary_text = job.get("score_summary") or "No summary available."
        console.print(
            Panel(
                Group(
                    Text(f"Score: {score:.1f}/10", style=f"bold {score_color}"),
                    Text(f"\n{summary_text}", style="dim"),
                ),
                title="AI Verdict",
                border_style=score_color,
            )
        )
    else:
        console.print("\n[dim]This job hasn't been scored yet.[/dim]\n")

    console.print()


def apply(
    job_id: int = typer.Argument(..., help="Job ID to mark as applied"),
) -> None:
    """Mark a job as applied. Optimistic of you."""
    try:
        response = httpx.patch(
            f"{API_BASE}/jobs/{job_id}/status", json={"status": "applied"}
        )
        response.raise_for_status()
        console.print(
            f"[green]Job {job_id} marked as applied. Good luck. You'll need it.[/green]"
        )
    except httpx.ConnectError:
        console.print("[red]API is not running.[/red]")
        raise typer.Exit(1)


def ignore(
    job_id: int = typer.Argument(..., help="Job ID to ignore"),
) -> None:
    """Mark a job as ignored. Sometimes that's the right call."""
    try:
        response = httpx.patch(
            f"{API_BASE}/jobs/{job_id}/status", json={"status": "ignored"}
        )
        response.raise_for_status()
        console.print(f"[yellow]Job {job_id} ignored. Probably for the best.[/yellow]")
    except httpx.ConnectError:
        console.print("[red]API is not running.[/red]")
        raise typer.Exit(1)


def clear(
    force: bool = typer.Option(False, "--force", "-f", help="Skip confirmation"),
) -> None:
    """Delete all saved jobs. Nuclear option."""
    if not force:
        confirm = typer.confirm("This will delete ALL jobs. Are you sure?")
        if not confirm:
            console.print("[yellow]Aborted. Smart choice.[/yellow]")
            raise typer.Exit(0)
    try:
        response = httpx.delete(f"{API_BASE}/jobs/")
        response.raise_for_status()
        result = response.json()
        console.print(f"[red]{result['message']}[/red]")
    except httpx.ConnectError:
        console.print("[red]API is not running.[/red]")
        raise typer.Exit(1)
