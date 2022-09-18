# Make Your Own Chatbot

Ever wanted to create a chatbot but weren't sure where to start?

Fork this repo for a starter OpenAI-powered chatbot that you can easily customize and deploy.

Built with [Remix](https://remix.run) and [TailwindCSS](https://tailwindcss.com), deployed to [Cloudflare Pages](https://pages.cloudflare.com). AI is powered by [OpenAI](https://openai.com/api).

All code in this project is MIT licensed

Created by [Dan Gurney](https://dangurney.net)

## Setup

- Fork this repo
- [Sign up for OpenAI](https://openai.com/api/) and create an API key 
  - You'll need to enter your credit card and you'll be charged for usage, but it's cheap - a fraction of a cent per request.
- Create a top-level `.env` file and paste in your API key like so:
```env
OPENAI_API_KEY=paste-api-key-here
```
- Customize the name and behavior of your chatbot in `app/routes/index.tsx` 
	- Follow the comments in the file
	- Perhaps your bot is a Western prospector who can offer advice on how to find gold 
	- Or maybe you're a pop singer who can answer questions about life on the road
- Create a logo using [Stable Diffusion](https://huggingface.co/spaces/stabilityai/stable-diffusion)	
  - Try a prompt like "A friendly wizard in the style of a comic book"
- When you have a logo you like, use [Favicon.io](https://favicon.io/favicon-converter/) to create favicons
	- It will output a zip file with all the different sized icons you need
	- Copy them into `public/` and overwrite the existing files

## Running Locally

```bash
# Install dependencies
$ yarn install --frozen-lockfile

# Start the development server
$ yarn dev

# View your chatbot at http://localhost:8788
```

## Deploying to Production

- [Sign up for Cloudflare Pages](https://pages.cloudflare.com) which has a generous free tier
- Create a new project in their UI and connect it to your chatbot repo
- It will automatically deploy every time you push to `master`
- Enjoy amusing your friends and enraging your enemies