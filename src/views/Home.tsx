import { Component } from '@geajs/core'
import About from '../components/About'
import Contact from '../components/Contact'
import Hero from '../components/Hero'
import Resources from '../components/Resources'
import Sites from '../components/Sites'
import Team from '../components/Team'

export default class Home extends Component {
  template() {
    return (
      <div>
        <Hero />
        <About />
        <Resources />
        <Sites />
        <Team />
        <Contact />
      </div>
    )
  }
}
