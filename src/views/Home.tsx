import { Component } from '@geajs/core'
import About from '../components/About'
import Contact from '../components/Contact'
import Hero from '../components/Hero'
import Sites from '../components/Sites'

export default class Home extends Component {
  template() {
    return (
      <div>
        <Hero />
        <About />
        <Sites />
        <Contact />
      </div>
    )
  }
}
