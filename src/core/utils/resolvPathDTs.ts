/*
 * @Author: saber2pr
 * @Date: 2019-05-27 19:53:22
 * @Last Modified by:   saber2pr
 * @Last Modified time: 2019-05-27 19:53:22
 */
export const resolvPathDTs = (path: string) =>
  '.' + path.split('.').filter(_ => _)[0] + '.d.ts'
