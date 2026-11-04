# Social App

A social media web app built with Angular to practice modern Angular features.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-000?logo=vercel&logoColor=white)](https://social-app-sigma-beryl.vercel.app)
![Angular](https://img.shields.io/badge/Angular-22-DD0031?logo=angular&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

**Live site:** https://social-app-sigma-beryl.vercel.app

## Features

- Register, log in, and change your password
- Timeline with posts, likes, comments, and sharing
- Post details page
- Profile page
- Notifications and suggestions
- Settings
- Route guards that keep signed-in and signed-out pages separate

## Tech stack

- Angular 22 (standalone components, router guards, HTTP interceptors)
- Tailwind CSS 4 and Flowbite
- Font Awesome
- Deployed on Vercel. Every push to `master` deploys automatically.

## Run locally

```bash
npm install
npm start
```

Then open `http://localhost:4200/`.

## Build

```bash
npm run build
```

The output goes to `dist/social-media/browser`.

## Tests

```bash
npm test
```
