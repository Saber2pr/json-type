/*
 * @Author: saber2pr
 * @Date: 2019-05-27 19:50:21
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-05-27 20:09:04
 */
import { FS } from '@saber2pr/node'
import { extname } from 'path'
import { jsonToDTs } from './transformer'
import { resolvPathDTs } from './utils'

export async function App(input: string, output: string) {
  const isDir = await FS.stat(input, 'dir')

  if (!(await FS.exists(output))) await FS.mkPath(output)

  const jsonFiles = isDir
    ? (await FS.search(input, 'file')).filter(f => extname(f) === '.json')
    : [input]

  const result = await Promise.all(
    jsonFiles.map<Promise<[string, string]>>(async path => {
      const outFileName = `${output}/${path.split('/').pop()}`

      const fileName = path
        .split('/')
        .pop()
        .split('.')[0]
      const json = (await FS.readFile(path)).toString()

      const outFileContent = jsonToDTs(fileName, json)

      return [outFileName, outFileContent]
    })
  )

  await Promise.all(
    result.map<Promise<void>>(async ([path, content]) => {
      await FS.writeFile(resolvPathDTs(path), content)
    })
  )
}
