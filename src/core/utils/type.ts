export namespace Type {
  export const isObject = (obj: any): obj is Object =>
    Object.prototype.toString.call(obj) === '[object Object]'

  export const isArray = <T>(obj: any): obj is Array<T> =>
    Object.prototype.toString.call(obj) === '[object Array]'
}
