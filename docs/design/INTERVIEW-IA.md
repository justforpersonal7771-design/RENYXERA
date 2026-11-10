# Interview section: information architecture (10 Nov 2026)

## Why this was redone
The owner could not tell where the books were ("Library" said nothing), the Last Moments pack was not reachable at all, and eight flat tabs
(Home, Library, Flashcards, Code lab, SQL, Tutor, Notebook, Progress) mixed things you read, things you do and things you look back on.

## Research, in one paragraph
Navigation research is consistent: a good structure answers *where am I, where can I go, what is here*; breadcrumbs show position but do not replace the
main menu; main categories should hold logically nested sub-pages. Revision apps add a visible "what is due or most at risk" view, a fast mode for
the days before an exam (cram / quick quiz), and more than one study format. Nothing in the sources contradicted using verbs for the top level.

## The structure
| Room | Pages (second row) | What it is for |
|---|---|---|
| Home | none | today's plan, the door to every room, weak spots, tracks |
| Learn | Books, Last moments | reading: whole books in 6 tracks, and the night-before pack |
| Practise | Flashcards, Code lab, SQL | doing: spaced cards, run code, SQL exercises |
| Test | Mock interview, Ask the tutor | being asked: scored mock answers and the AI tutor |
| Review | Progress and mistakes, Notebook | looking back: what you read, what you miss, what you noted |

- Rooms are named for what you DO there (verbs), not for content types.
- Every page shows a breadcrumb (Interview > Learn > Books) and a Back button; the section menu is sticky and frosted.
- "Library" is now "Books". The landing pages (/interview/learn, /interview/practise) say plainly what is where.

## Last moments (/interview/last-moments)
Every book's final revision sheet, trap list, key snippets and glossary on one page, filtered by track, each book folding open and shut, printable. The
three PDF packs (last moments, traps, snippets) download from a private storage bucket when uploaded
(`node --env-file=.env.local scripts/upload-interview-packs.mjs "D:/Projects/interview-books"`). A "10-minute cram" button opens the flashcards on
starred cards, due first, 40 at a time.

## Upgrades made with it
- Flashcard answers (Again / Got it) are saved to Review, so cards you keep missing show in Progress and mistakes.
- Cram mode for flashcards (`/interview-cards?cram=1`).
- The tutor tabs live in the address (`/interview/tutor?mode=mock|chat`), so the sub-menu links and Back work.

## Still to do
Multi-question mock sessions with a summary, an interview date with an auto plan from the 2/4/8-week plans in the Interview bank, and sync of the
flashcard schedule to the account (today it is kept on the device).
