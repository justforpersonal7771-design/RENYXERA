# Study tabs v2 (18 Nov 2026, for owner review)

## Patterns borrowed (and why)
| Product | Pattern | Use here |
|---|---|---|
| Chrome / Edge | Open in new tab from any link; "+" opens a New Tab page with search; reopen closed tab; Ctrl+1…8 to jump | Library rows get "Open in new tab"; "+" opens a New Tab page inside the study area; reopen last closed tab |
| VS Code | Pinned tabs at the left, drag to reorder, preview vs kept tabs, Ctrl+Tab switcher | Pin and reorder (kept); keyboard switching between tabs |
| Arc / Notion | Tabs survive reloads and new visits | Tabs saved on the device |
| Kindle / Apple Books | Each book reopens where you left off | Each tab restores its reading position |

## Behaviour
- **Open in new tab**: every ready chapter in the library (open-book contents and the phone drawer) has a "New tab" button next to Read. It adds a tab and opens it; if already open, it focuses it.
- **New Tab page** (`/study/new`): the "+" opens a page that lists your open tabs, ready chapters with search, and recently closed tabs. Picking one opens it in that tab.
- **Reopen closed tab**: the New Tab page lists the last 5 closed tabs; Shift+Alt+T reopens the most recent.
- **Keyboard**: Alt+1 to Alt+8 jump to a tab, Alt+] / Alt+[ next and previous, Alt+W closes the current tab (Alt is used because Ctrl+number belongs to the browser).
- **Kept from v1**: one tab per chapter, pin, drag to reorder, close others, limit of 8 with a notice, reading position per tab, missing chapters pruned.

## Edge cases
| Case | Behaviour |
|---|---|
| New Tab page with nothing ready yet | Shows the library link instead of an empty list |
| Closing the only tab | Goes to the library; the closed tab can be reopened |
| Alt shortcuts while typing in a note or the Mentor | Ignored inside inputs and text areas |
| Opening a tab past the limit | Oldest unpinned tab that is not current closes, with a notice |
| Phone | Tab strip scrolls sideways; keyboard shortcuts simply do not apply |

## Later
Side-by-side reading of two tabs on wide screens; syncing tabs to the account.
