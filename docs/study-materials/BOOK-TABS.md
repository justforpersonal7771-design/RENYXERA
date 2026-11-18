# Study tabs: several chapters open at once (18 Nov 2026, for owner review)

## What it does
A tab strip sits above every lesson. Each open chapter is a tab (subject on top, chapter below, the book's colour dot).
- Opening any chapter adds a tab, or focuses it if it is already open (no duplicates).
- Click a tab to switch. Each tab returns to where you were reading in it.
- Close with the x (always visible on the current tab, on hover for others). Closing the current tab shows its neighbour, or the library if it was the last one.
- Drag tabs to reorder. Double-click or right-click > Pin to pin; pinned tabs stay at the front and cannot be closed by accident.
- Right-click menu: Pin, Close other tabs, Close tab.
- The + button lists every ready chapter to open next, plus "Browse the library".

## Patterns borrowed
Browser tabs (Chrome: pin, close others, drag), editor tabs (VS Code: active tab joins the page, others recede), reading apps that keep your place per book (Kindle, Apple Books).

## Edge cases handled
| Case | Behaviour |
|---|---|
| Same chapter opened twice | Focuses the existing tab, refreshes its title |
| More than 8 tabs | Closes the oldest tab that is not pinned and not being read, and says so in a short note |
| Closing the tab you are reading | Goes to the next tab, else the previous, else the library |
| Reload or come back tomorrow | Tabs and order are kept on this device (localStorage); reading positions are kept for the browser session |
| A chapter is renamed | Its tab title updates the next time it opens |
| A chapter is removed or unpublished | Its tab is dropped on the next lesson load (only chapters in the catalog are kept) |
| Private mode or storage blocked | Tabs still work for the current page; nothing is saved |
| Many tabs on a phone | The strip scrolls sideways; the active tab is scrolled into view |
| Keyboard and screen readers | Tabs are links inside a tablist; the current tab is marked as the current page |

## Not in this version (later)
- Side-by-side reading (two chapters split on one screen on wide desktops).
- Syncing open tabs across devices through the account.
- A tab preview card on hover.
