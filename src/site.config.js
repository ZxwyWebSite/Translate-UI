module.exports = {
  // 站点信息(图标,标题,关键词,描述)
  site: {
    icon: '/logo2.png',
    title: 'Zxwy翻译',
    keywords: 'Zxwy翻译,Zxwy,子虚乌有,zxwy.tk',
    description: 'Zxwy生草机，把一段文字变得生草。由谷歌翻译提供支持。——ZxwyWebSiteProject.ZxwyGGC'
  },
  // 接口信息(地址,调用格式)
  api: {
    address: '/api.php',
    request: 'mode={$mode}&from={$from}&to={$to}&text={$text}&force={$force}'
  },
  // 欢迎语(翻译模式,生草模式)
  welcome: {
    trans: '海内存知己，天涯若比邻。欢迎使用Zxwy翻译机！',
    grass: '须弥空荡荡，草神在人间。欢迎使用Zxwy生草机！'
  }
}
