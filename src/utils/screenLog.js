/* eslint-disable */
export const printANSI = () => {
  // console.clear()
  console.log('[antd pro] created()')
  // ASCII - ANSI Shadow
  let text = `
 █████╗ ███╗   ██╗████████╗██████╗     ██████╗ ██████╗  ██████╗ 
██╔══██╗████╗  ██║╚══██╔══╝██╔══██╗    ██╔══██╗██╔══██╗██╔═══██╗
███████║██╔██╗ ██║   ██║   ██║  ██║    ██████╔╝██████╔╝██║   ██║
██╔══██║██║╚██╗██║   ██║   ██║  ██║    ██╔═══╝ ██╔══██╗██║   ██║
██║  ██║██║ ╚████║   ██║   ██████╔╝    ██║     ██║  ██║╚██████╔╝
╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═════╝     ╚═╝     ╚═╝  ╚═╝ ╚═════╝ 
\t\t\t\t\tPublished ${APP_VERSION}-${GIT_HASH} @ antdv.com
\t\t\t\t\tBuild date: ${BUILD_DATE}`
  console.log(`%c${text}`, 'color: #fc4d50')
}
