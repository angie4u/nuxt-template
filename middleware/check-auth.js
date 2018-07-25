export default function (context) {

  /**
   * server side에서 initAuth 가 실행될 경우, localStorage 함수가 없기때문에 에러가 발생하게 된다. 
   * 프로레스가 client단에서 실행될 경우에만 initAuth 함수 실행
   */
  if (process.client) {
    context.store.dispatch('initAuth')
  }
}
