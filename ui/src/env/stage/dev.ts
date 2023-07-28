export default {
  // Project properties
  PROJECT_NAME: 'restarve.pro',
  PROJECT_VERSION: [2, 0, 0],
  PROJECT_VERSION_CHANNEL: 'pre-alpha',

  // Lolipop UI environment properties
  LOLIPOP_ENV: process.env.NODE_ENV,
  LOLIPOP_LOBBY_URL: `${location.protocol}//localhost:9000`,
  LOLIPOP_BUILD_HASH: process.env.LOLIPOP_UI_GIT_HASH,
}