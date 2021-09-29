/* eslint-disable */
export const printANSI = () => {
  // console.clear()
  console.log('[wall] broken()')
  // ASCII - ANSI Shadow
  let text = `
 __          __   _ _ ____                 _                 
 \\ \\        / /  | | |  _ \\               | |                
  \\ \\  /\\  / /_ _| | | |_) |_ __ ___  __ _| | _____ _ __ ___ 
   \\ \\/  \\/ / _\` | | |  _ <| '__/ _ \\/ _\` | |/ / _ \\ '__/ __|
    \\  /\\  / (_| | | | |_) | | |  __/ (_| |   <  __/ |  \\__ \\
     \\/  \\/ \\__,_|_|_|____/|_|  \\___|\\__,_|_|\\_\\___|_|  |___/
                                                             
\t\thttps://github.com/orgs/WallBreaker-Tongji/`
  console.log(`%c${text}`, 'color: #fc4d50')
  console.log('%c感谢使用济星云中台！', 'color: #000; font-size: 14px;    font-family: Hiragino Sans GB,Microsoft YaHei,\\\\5FAE\\8F6F\\96C5\\9ED1,Droid Sans Fallback,Source Sans,Wenquanyi Micro Hei,WenQuanYi Micro Hei Mono,WenQuanYi Zen Hei,Apple LiGothic Medium,SimHei,ST Heiti,WenQuanYi Zen Hei Sharp,sans-serif;')
  console.log('%cThanks for using Jixingyun middle-end!', 'color: #fff; font-size: 14px; font-weight: 300; text-shadow:#000 1px 0 0,#000 0 1px 0,#000 -1px 0 0,#000 0 -1px 0;')
}
