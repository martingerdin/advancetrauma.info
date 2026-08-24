import { createHash } from 'node:crypto'
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

function hashPassword(password) {
  return createHash('sha256').update(password).digest('hex')
}

async function main() {
  const providedPassword = process.argv[2]

  if (providedPassword) {
    console.log(hashPassword(providedPassword))
    return
  }

  const readline = createInterface({ input, output })

  try {
    const password = await readline.question('TMG password: ')

    if (!password) {
      console.error('No password provided.')
      process.exitCode = 1
      return
    }

    console.log(hashPassword(password))
  } finally {
    readline.close()
  }
}

await main()
