# Kalynn Loftis | Personal Website

My personal website, built for ISDS 4125 (Analysis and Design of Information Systems) at LSU. It has a single-page home with my profile, skills, experience, and contact information, plus separate pages for my resume and a featured project: a breach risk assessment of the medical sector. I built it with Google's Antigravity IDE and host it on GitHub Pages.

**Live site:** https://kalynnloftis02.github.io/kalynn-website/

## Reflection

After I asked the agent to make my homepage stat cards overlap the banner and match in height, the About Me text changed but none of the styling did, even though the agent said the CSS was updated. I asked it to figure out why. It explained that my pages load the stylesheet as `styles.css?v=5`, and because my browser had already saved a file with that exact URL, it kept showing the old version instead of downloading the new one. Changing the link to `?v=8` on all three pages gave the browser a URL it had never seen, so it fetched the updated file. I learned that browsers cache CSS by its exact address, and that bumping a version number is a simple way to make sure visitors see your latest changes.
