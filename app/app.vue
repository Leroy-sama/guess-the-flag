<template>
  <NuxtPage />
</template>

<script setup lang="ts">
const siteTitle = 'Guess the Flag'
const siteDescription =
  'A party geography quiz — guess the country from its flag, capital, or language. Free play or timed challenges.'

useSeoMeta({
  title: siteTitle,
  description: siteDescription,
  ogTitle: siteTitle,
  ogDescription: siteDescription,
  ogType: 'website',
  twitterCard: 'summary',
  twitterTitle: siteTitle,
  twitterDescription: siteDescription,
})

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  titleTemplate: (title) => (title && title !== siteTitle ? `${title} · ${siteTitle}` : siteTitle),
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=Outfit:wght@400;500;600;700&display=swap',
    },
  ],
})
</script>
