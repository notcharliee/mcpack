/** @type {import("next").NextConfig} */
const config = {
  output: "export",
  images: {
    remotePatterns: [
      {
        hostname: "raw.githubusercontent.com",
      },
    ],
  },
}

export default config
