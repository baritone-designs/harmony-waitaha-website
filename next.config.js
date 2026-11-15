/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: false,
    experimental: {
        reactDebugChannel: false,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
};

module.exports = nextConfig;
