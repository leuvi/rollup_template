import { version } from '../package.json'
import dayjs from 'dayjs'
import moduleA from './module/a'

function main() {
  const sun = new Sun('索拉卡')
  sun.show()
  moduleA()
  console.log(version)
  console.log(dayjs().format('YYYY-MM-DD HH:mm:ss'))
}

class Sun {
  constructor(name) {
    this.name = name
  }
  show() {
    console.log(this.name)
  }
}

export default main