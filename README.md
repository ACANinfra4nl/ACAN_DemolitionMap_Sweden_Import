# Rivningskartan

Shows threatened, demolished, and saved buildings in Sweden.

Built using [Next.js](https://nextjs.org/) with [Sanity](https://www.sanity.io/) as CMS.

## Development setup

- Install node v18.16.0
- Run `npm ci`
- Create a `.env.local` file by copying the `.env.example` and filling in all the variables
- Start the dev server with `npm run dev`
- By default, the site runs on http://localhost:3000 with Sanity studio on http://localhost:3000/studio

## Production setup

The site is deployed automatically from the `main` branch to Vercel at https://acan-rivningskartan.vercel.app/ and Sanity studio on https://acan-rivningskartan.vercel.app/studio. Environment variables are setup using the Vercel admin panel.

## Importing content

A rudimentary import API endpoint can be found at [api/import](./src/app/api/import/route.ts). It sohuld only be run locally and requires images to be available locally in a folder called `import-images` in the root of the project. Call the endpoint using curl:

```sh
curl -X POST --data-binary @<path-to-csv> http://localhost:3000/api/import
```
