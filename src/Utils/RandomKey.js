/*
 * @Description  : random key
 * @Author       : 王占领
 * @Date         : 2022-02-23 11:42:19
 * @LastEditTime : 2022-02-23 11:44:50
 * @LastEditors  : 王占领
 */
export default {
   /**
    * 生成一个由随机字母与数字组成的字符串——key
    *
    * @param {Number} length key的长度，默认16位
    * @returns key值
    */
   getKey (length = 16) {
      var s = ''
      var randomChar = function () {
         var n = Math.floor(Math.random() * 62)
         if (n < 10) return n // 1-10
         if (n < 36) return String.fromCharCode(n + 55) // A-Z
         return String.fromCharCode(n + 61) // a-z
      }

      while (s.length < length) s += randomChar()

      return s
   }
}
