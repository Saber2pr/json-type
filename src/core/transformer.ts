/*
 * @Author: saber2pr
 * @Date: 2019-05-27 20:08:46
 * @Last Modified by:   saber2pr
 * @Last Modified time: 2019-05-27 20:08:46
 */
import { resolvJsonTypes, headUpper, Type, filterChar } from './utils'

export const jsonToDTs = (name: string, json: string): string => {
  const obj = JSON.parse(json)
  const objTyped = transform(obj)

  const newJson = JSON.stringify(objTyped)

  const interfBody = resolvJsonTypes(newJson)

  return toInterface(name, interfBody)
}

export const toInterface = (name: string, content: string) =>
  `interface ${headUpper(name)} ${content}`

function transform(data: Object) {
  if (Type.isObject(data)) {
    return parseObj(data)
  } else if (Type.isArray(data)) {
    return parseArr(data)
  } else {
    return typeof data
  }
}

const parseObj = (data: Object) => {
  if (Type.isArray(data)) return parseArr(data)

  if (!Type.isObject(data)) return typeof data

  return Object.entries(data).reduce(
    (out, [k, v]) => Object.assign(out, { [filterChar(k)]: parseObj(v) }),
    {}
  )
}

const parseArr = (arr: Array<any>) =>
  `Array<${resolvJsonTypes(JSON.stringify(transform(arr[0])))}>`
