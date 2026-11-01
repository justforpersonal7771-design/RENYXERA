# Image prompts for the AI Mentor logo

Use with any image generator (Gemini, ChatGPT images, Midjourney, Ideogram). Step 1 gives ten concepts in one picture; step 2 finalises the one you pick. Keep the wording short so the generator has room to surprise you.

## Prompt 1: ten concepts in one image
```
One image containing 10 different logo concepts for an AI study mentor chatbot, for students preparing for the GATE engineering exam. Brand name: RENYXERA. Colours: gradient from cyan #06c2fb through violet #5b21e0 to magenta #dd42fb. Flat vector style, clean shapes, white background, laid out as a 5 by 2 grid, each concept numbered 1 to 10, no other text.
```

## Prompt 2: finalise the one you choose
Attach the sheet from step 1, then:
```
Take concept number [N] from the attached image and make the final logo. Keep its design exactly; only polish it: perfectly symmetric, crisp vector edges, even stroke widths. Single mark, centred, no text, no extra elements. Deliver it three ways: gradient on a transparent background, the same on a dark background, and as a white mark on a rounded-square app icon with the same gradient. 1024 by 1024 pixels.
```

## After you have the final image
Tell me the file path. I will trace it to a vector mark, replace the compass-and-spark mark in the top bar, the chat, and the thinking animation (they all read from one shape: `components/brand/mentor-mark.tsx`), and export SVG and PNG sizes.
