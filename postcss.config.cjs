module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 37.5, // 设计稿宽度 375px -> 1rem = 10px时可改成 37.5
      propList: ['*']
    }
  }
}
