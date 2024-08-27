import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],

    theme: {
        extend: {
            colors: {
                qa: {
                    'blue-darker': '#101C2A',
                    'blue-dark': '#112338',
                    'blue': '#18C0DE',
                    'white': '#ced0de',
                },
                hw: {
                    black: '#110E0E',
                    blue: '#1BC0DD',
                    red: '#DA1F26',
                    white: '#F1F0EF',
                },
                pm: {
                    blue: '#8DA7D6',
                    red: '#DD0000',
                },
            },
        },

        fontFamily: {
            'c-gothic': ['var(--font-century-gothic)', 'sans-serif'],
            'pt-sans': ['var(--font-pt-sans)', 'sans-serif'],
            'ar-gothic': ['all-round-gothic', 'sans-serif'],
            'harmony': ['var(--font-harmony)', 'sans-serif'],
            'poppins': ['var(--font-poppins)', 'sans-serif'],
        },

        dropShadow: {
            'qa-glow-intense': '0 0 5px #18c0de',
            'qa-glow-light': '0 0 10px #18c0deb6',
        },
    },
    plugins: [],
};
export default config;
