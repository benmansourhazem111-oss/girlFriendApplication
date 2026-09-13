# Girlfriend Application 💗

A small static website connected to Supabase.

## 1. Create the database

Open your Supabase project, go to **SQL Editor**, paste `supabase.sql`, and run it.

## 2. Add the public key

Open `config.js` and replace:

PASTE_YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY_HERE

with your Supabase **anon/publishable key**.

Do NOT use the `service_role` or any secret key in a browser website.

## 3. Test locally

You can use VS Code + Live Server, or any static hosting service.

## 4. Publish on GitHub Pages

Create a GitHub repository, upload all files, then:
Settings -> Pages -> Deploy from branch -> main -> /root

The scoreboard is ordered by application submission time, so the first applicant is #1.
The selected date is displayed on the scoreboard.

## Privacy note

This demo stores the height and weight fields because the requested form includes them. The public scoreboard does not display either field. For a real public deployment, consider whether you actually need to collect those fields and add authentication or tighter database policies if the data should remain private.
