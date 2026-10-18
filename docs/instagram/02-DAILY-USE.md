# Instagram: daily use

## Adding a post
Add an object to `content/calendar.json`:

```json
{
  "id": "unique-name",
  "date": "2026-10-25",
  "time": "19:00",
  "pillar": "pyq",
  "title": "short internal name",
  "caption": "Hook in the first line. Then one useful thing. Then the link line.",
  "hashtags": ["#GATE2027", "#GATECSE", "#GATEprep"],
  "media_url": "https://<public link from social-upload>",
  "link": "https://gate.renyxera.workers.dev/?utm_source=instagram&utm_campaign=unique-name",
  "channels": ["instagram", "telegram"],
  "status": "approved"
}
```

- `status`: `draft` (not posted), `approved` (posts when the date and time pass, IST), `posted` (done, set by the bot).
- `channels`: remove `telegram` to post to Instagram only. A Telegram post goes to the hub channel.
- A `.mp4` link posts as a Reel; a `.jpg` or `.png` link posts as a single image.
- If a post fails, the entry gets an `error` field; fix it and run **Actions, social-publish, Run workflow**.

## Rhythm that works (from the playbook)
- 1 post a day, 3 to 5 Reels a week. Hook in the first second, captions with one idea, one link.
- Pillars: PYQ of the day, topic trick, weightage fact, mock reminder, product feature, student story.
- Vertical 1080x1920 Reels, under 50 MB for the free bucket, under 90 seconds.

## Weekly 10 minutes
Open Instagram Insights: note reach, saves, shares per post; keep what is saved and shared. Put the numbers in the tracking sheet (task G-5).
