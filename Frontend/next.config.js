/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['res.cloudinary.com'],
  },
  env: {
    SERVER_ADRESS: "http://localhost:3000",
    EDITOR_API_KEY: "9xb3tr7880lmbsherfxfjqyxp911gprdervklx0qi9dsflws"
  }
};

module.exports = nextConfig;
