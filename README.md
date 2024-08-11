<div align="center">
  <a href="https://harmony-waitaha.vercel.app/">
    <img src="src/app/hw-logo.svg" alt="Harmony Waitaha" height="140">
  </a>
</div>

# harmony-waitaha-website
Codebase for Harmony Waitahas public web suite

## Tech Stack

| Package                                                                            | Description                                                                                           |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [`NextJS`](https://nextjs.org/)                                                    | Used for public routing and front end                                                                 |
| [`Typescript`](https://www.typescriptlang.org/)                                    | Used for Type Safety                                                                                  |
| [`Tailwind`](https://tailwindcss.com/)                                             | Used as an alternative to pure css allowing styling to be done directly in html                       |
| [`TRPC`](https://trpc.io/)                                                         | Used for the majority of server endpoints. Allows typesafe communication between front end and server |
| [`Prisma`](https://www.prisma.io/)                                                 | An ORM used for interfacing the postgres database and declaring the database schema                   |
| [`Postgres`](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) | Postgres is our database of choice.                                                                   |
| [`Vercel BLOB`](https://vercel.com/storage/blob)                                   | Used for storing data which cannot be put in a relational database                                    |

## Repo Structure

| Path                               | Description                                                                                                                            |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| [`prisma`](prisma)                 | Contains the prisma schema file, and any migrations if they are created                                                                |
| [`public`](public)                 | Contains static assets for the website, ideally this folder will not be needed at some point                                           |
| [`types`](types)                   | Contains type defs that should be global, mainly it contains next-auth type structures                                                 |
| [`src/app`](src/app)               | Contains the next-js routing file structure and all page/layout specific files (Note that there can and will be back end code in here) |
| [`src/assets`](src/assets)         | Contains static asset files that are imported with a javascript import                                                                 |
| [`src/assets`](src/assets)         | Contains static asset files that are imported with a javascript import                                                                 |
| [`src/common`](src/common)         | Contains code which need to be shared between front end and server                                                                     |
| [`src/components`](src/components) | Contains Front End (or server rendered) code (not neccesarily react components)                                                        |
| [`src/pages`](src/pages)           | Contains api routes for packages which require the legacy pages router (i.e. next-auth and trpc)                                       |
| [`src/providers`](src/providers)   | Joran should probably put this in [`src/components`](src/components)                                                                   |
| [`src/server`](src/server)         | Contains the bulk of server code not related to rendering, mostly trpc code                                                            |

## Environment

Config for the project is done with an untracked `.env` file. The structure of this is documented in [`environment.ts`](src\common\environment.ts).

### Database

You must have a postgres instance running locally or one on a personal server as we do not have a hosted development database. Postgres server can be downloaded [here](https://hub.docker.com/_/postgres). Alternatively you can run a [docker image](https://hub.docker.com/_/postgres).

Vercel BLOB storage cannot be run locally and we do not have a development instance so please be **EXTREMELY** careful when working with this once we are in production.

> [!IMPORTANT]
> Vercel BLOB `onUploadCompleted` will not be called on localhost sites so any image uploads which require a post upload task will not work properly on local

## Commands

| Command                    | Description                                                                                                                                                                                                                                                                                          |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`              | Runs a development instance of the NextJS website (this includes the server minus storage/database). This will also generate the Prisma Client code                                                                                                                                                  |
| `npm run build`            | This will compile the NextJS website including server minus storage/database. This will also generate the Prisma Client code and push the prisma schema to the postgres database. It is recommended you run this before pushing to check for compile errors as `npm run dev` will **NOT** catch them |
| `npm run build:production` | Same as `npm run build` without pushing the prisma schema to postgres                                                                                                                                                                                                                                |
| `npm run start`            | This will run an instance of the last compiled NextJS website (`npm run build`)                                                                                                                                                                                                                      |
| `npm run start:production` | Same as `npm run start` as well as pushing the prisma schema to postgres                                                                                                                                                                                                                             |
| `npm run lint`             | Runs the  linter                                                                                                                                                                                                                                                                                     |

## Dev tools

If using vscode, it is recommended you use the following packages:

* [Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint). This one is **HEAVILY** recommended so you don't commit incorrect code style
* [Tailwind CSS InteliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
* [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)