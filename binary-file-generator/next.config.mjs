/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/scrollingmode',
          permanent: true, // true pour une redirection permanente (301)
        },
      ];
    },
  };
  
  export default nextConfig;