"""Shared code snippets for Forge question specs (read from the part files without running them)."""
import ast, pathlib
_d = pathlib.Path(__file__).parent


def _const(fname, name):
    tree = ast.parse((_d / fname).read_text(encoding="utf-8"))
    for n in tree.body:
        if isinstance(n, ast.Assign) and n.targets[0].id == name:
            return ast.literal_eval(n.value)
    raise KeyError(name)


FF = _const("author_b008_p2.py", "FF")          # FIRST / FOLLOW / nullable for context-free grammars
CUBES = _const("author_b008_p3.py", "CUBES")    # prime implicants of a Boolean function
