from spite.cli.commands import console


def version() -> None:
    """Print version and exit. At least something works as expected."""
    from spite import __version__

    console.print(
        f"spite [bold]{__version__}[/bold] — still less broken than the job market."
    )
