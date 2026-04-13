import typer
from rich.align import Align
from rich.console import Console, Group
from rich.panel import Panel
from rich.text import Text

from spite.commands.jobs import apply, clear, ignore, inspect, list_jobs
from spite.commands.search import search
from spite.commands.version import version

app = typer.Typer(
    name="spite",
    help="Automated job hunting. Because optimism is for people with trust funds.",
    add_completion=False,
    rich_markup_mode="rich",
)

console = Console()

app.command()(search)
app.command()(version)
app.command(name="list-jobs")(list_jobs)
app.command()(inspect)
app.command()(apply)
app.command()(ignore)
app.command()(clear)


@app.callback(invoke_without_command=True)
def main(ctx: typer.Context) -> None:
    if ctx.invoked_subcommand is None:
        title = Text.assemble(
            ("\n", ""),
            (" S P I T E ", "bold white on red"),
            ("\n", ""),
        )
        banner = Panel(
            Align.center(
                Group(
                    title,
                    Text(
                        "\nAutomated job hunting for the cynical developer.",
                        style="dim italic",
                    ),
                    Text("The market is broken. This is the patch.\n", style="red"),
                )
            ),
            border_style="red",
            padding=(1, 2),
        )
        console.print(banner)
        console.print(
            Align.center("Run [bold]spite --help[/bold] to see available commands.\n")
        )


if __name__ == "__main__":
    app()
