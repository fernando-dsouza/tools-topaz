import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/topaz-tools',
                permanent: false,
            },
        ];
    },
};

export default nextConfig;
