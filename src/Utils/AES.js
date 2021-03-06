import CryptoJS from "crypto-js/crypto-js";

const AESKEY = import.meta.env.AESKEY;
const AESIV = import.meta.env.AESIV;

const createKey = (aesKey) =>
   CryptoJS.enc.Utf8.parse(CryptoJS.MD5(aesKey).toString());
const createIv = (aesIv) =>
   CryptoJS.enc.Utf8.parse(CryptoJS.MD5(aesIv).toString().substr(0, 16));
const createOptions = (aesIv) => ({
   iv: createIv(aesIv),
   mode: CryptoJS.mode.CBC,
   padding: CryptoJS.pad.ZeroPadding
});

export function encryption(obj, key = AESKEY, iv = AESIV) {
   try {
      const aesResult = CryptoJS.AES.encrypt(
         JSON.stringify(obj),
         createKey(key),
         createOptions(iv)
      ).toString();
      return aesResult;
   } catch (error) {
      return "";
   }
}
export function decryption(str, key = AESKEY, iv = AESIV) {
   try {
      const decryptResult = CryptoJS.AES.decrypt(
         str,
         createKey(key),
         createOptions(iv)
      );
      const resData = decryptResult.toString(CryptoJS.enc.Utf8); // 因为解析出来是一个字符串，又转换成为字符串，所以需要反序列化两次
      return JSON.parse(resData);
   } catch (error) {
      console.warn("[decryption warn]:", error);
      return null;
   }
}
