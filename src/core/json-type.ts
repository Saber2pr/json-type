import { FS, Terminal } from '@saber2pr/node'
import { Type } from './utils/type'
import { dirname, extname } from 'path'

const [input, output = dirname(input)] = Terminal.getParams()

export async function App() {
  const isDir = await FS.stat(input, 'dir')

  if (!(await FS.exists(output))) await FS.mkPath(output)

  const jsonFiles = isDir
    ? (await FS.search(input, 'file')).filter(f => extname(f) === '.json')
    : [input]

  const result = await Promise.all(
    jsonFiles.map<Promise<[string, string]>>(async path => {
      const outFileName = `${output}/${path.split('/').pop()}`

      const json = (await FS.readFile(path)).toString()

      const outFileContent = resolveJsonToInterf(
        JSON.stringify(transform(JSON.parse(json)))
      )

      return [outFileName, outFileContent]
    })
  )

  await Promise.all(
    result.map<Promise<void>>(async ([path, content]) => {
      const fileName = path
        .split('/')
        .pop()
        .split('.')[0]

      await FS.writeFile(resolvPath(path), toInterface(fileName, content))
    })
  )
}

const toInterface = (name: string, content: string) =>
  `interface ${name.toUpperCase()} ${content}`

const resolvPath = (path: string) =>
  '.' + path.split('.').filter(_ => _)[0] + '.d.ts'

const resolveJsonToInterf = (json: string) => json.replace(/"/g, '')

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
  `Array<${resolveJsonToInterf(JSON.stringify(transform(arr[0])))}>`

const filterChar = (word: string) => word.replace(/\/|\@/g, '_')
