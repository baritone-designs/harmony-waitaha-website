import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],

    theme: {

        extend: {

            animation: {
                delayed_fade_in: 'delayed_fade_in 5s ease-in-out',
                fade_in: 'fade 0.3s ease-in forwards',
                fade_out: 'fade 0.3s ease-out forwards reverse',
                error: 'error 5s ease forwards',
                collapse_row: 'collapse_row 0.3s ease-in-out forwards',
            },

            colors: {
                'blue-darker': '#101C2A',
                'blue-dark': '#101e2e',
                'blue-qa': '#18C0DE',
                'white-qa': '#ced0de',
                'success': '#166534',
                'error': '#991b1b',
            },
        },

        fontFamily: {
            sans: ['var(--font-pt-sans)', 'sans-serif'],
            round: ['all-round-gothic', 'sans-serif'],
        },

        dropShadow: {
            'glow-intense': '0 0 5px #18c0de',
            'glow-light': '0 0 10px #18c0deb6',
        },
    },
    plugins: [],
};
export default config;
