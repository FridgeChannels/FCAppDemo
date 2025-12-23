# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## IndexTTS2 (optional) – higher-quality TTS recap audio

The app can play a local static recap audio file at `public/recap.wav` (auto-play on refresh when enabled).

- **Generator**: [IndexTTS2](https://indextts2.org/)
- **Script**: `scripts/generate_indextts2_audio.py`
- **Recap text source**: `src/data/recapText.zh-CN.txt`

### Generate `public/recap.wav` (local)

1) Install IndexTTS:

```bash
pip install indextts
```

2) Prepare IndexTTS checkpoints/config and a reference voice wav file (see IndexTTS2 docs).

3) Run:

```bash
python3 scripts/generate_indextts2_audio.py \
  --voice /path/to/reference_voice.wav \
  --model-dir /path/to/checkpoints \
  --cfg-path /path/to/checkpoints/config.yaml \
  --text-file src/data/recapText.zh-CN.txt \
  --out public/recap.wav
```

### Use IndexTTS2 audio in the app

Set env var and restart dev server:

```bash
VITE_TTS_ENGINE=indextts2 npm run dev
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
