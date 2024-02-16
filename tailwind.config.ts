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
            },
        },

        fontFamily: {
            'qa-sans': ['var(--font-pt-sans)', 'sans-serif'],
            'qa-round': ['all-round-gothic', 'sans-serif'],
        },

        dropShadow: {
            'qa-glow-intense': '0 0 5px #18c0de',
            'qa-glow-light': '0 0 10px #18c0deb6',
        },
    },
    plugins: [],
};
export default config;
