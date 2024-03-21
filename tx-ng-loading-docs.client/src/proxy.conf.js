const PROXY_CONFIG = [
  {
    context: [
      "/document",
    ],
    target: "https://localhost:7125",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
