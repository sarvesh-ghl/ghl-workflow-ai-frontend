/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL,
        ELASTICSEARCH_INDEX: process.env.ELASTICSEARCH_INDEX,
    }
};

export default nextConfig;
