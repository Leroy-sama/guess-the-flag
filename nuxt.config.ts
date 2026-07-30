import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: ['@nuxt/icon', '@nuxt/image'],
  css: ['./app/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'Guess the Flag',
      meta: [
        {
          name: 'description',
          content:
            'A party geography quiz — guess the country from its flag, capital, or language. Free play or timed challenges.',
        },
        { name: 'theme-color', content: '#0c1222' },
      ],
      script: [
        {
          key: 'theme-init',
          // Runs before paint to avoid a light/dark flash; keep in sync with theme.client plugin
          innerHTML: `(function(){try{var s=localStorage.getItem('theme');var d=s==='dark'||(s!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})();`,
          type: 'text/javascript',
          tagPosition: 'head',
        },
      ],
    },
  },
})
