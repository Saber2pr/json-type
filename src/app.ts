#!/usr/bin/env node

import { dirname } from 'path'
import { Terminal } from '@saber2pr/node'
import { App } from '.'

const [input, output = dirname(input)] = Terminal.getParams()

async function main() {
  if (input === '-v') {
    const pkg = await Terminal.getCurrentPkgConfig(__dirname)
    console.log(`v${pkg.version}`)
  } else {
    await App(input, output)
  }
}

main().catch(console.log)
