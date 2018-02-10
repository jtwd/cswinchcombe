import './modules/setUp';
import 'svgxuse'; //Polyfill for IE11 to support "use" tags in SVGs
import advTest from 'cut-the-mustard/advanced';
import './asyncModules'; // Async Module loader
import Breakpoint from './modules/Breakpoint'; // breakpoint module
import FontLoader from './modules/FontLoader'; // font loader module
import UpdateCopyrightYear from './modules/CopyrightYear'; // font loader module
import scrollToElement from 'scroll-to-element'
import verge from 'verge'
import throttle from 'throttleit'

function setActiveSection() {
  const sections = ['services', 'team', 'history', 'contact']
  const vpHeight = window.innerHeight / 2
  const offsetHeight =- vpHeight;
  
  for (var i = 0; i < sections.length; i++) {
    const link = document.querySelector(`.Main-nav a[href="#${sections[i]}"]`)
    const section = document.getElementById(sections[i])
    if (verge.inViewport(section, offsetHeight)) {
      link.classList.add('active')
    } else {
      link.classList.remove('active')
    }
  }
}

function addScrollListener() {
  window.addEventListener('resize', setActiveSection)
  window.addEventListener('scroll', setActiveSection)
}

function removeScrollListener(targetId) {
  if (targetId !== '#top') {
    const section = document.querySelector(targetId)
    section.tabIndex = 0
  }
  window.removeEventListener('resize', setActiveSection)
  window.removeEventListener('scroll', setActiveSection)
}

function removeTabIndex() {
  const section = document.querySelector('.page-section[tabindex]')
  if (section) {
    section.removeEventListener('blur', removeTabIndex)
    section.removeAttribute('tabindex')
  }
}

function atomic_initialise() {
  const fontConfig = {
    google: {
      Lato: [{ weight: '300' }, { weight: '400' }, { weight: '500' }]
    }
  };
  FontLoader.init(fontConfig);

  const nav = document.querySelector('.Site-header');
  nav.addEventListener('click', (evt) => {
    let target = evt.target
    if (target.nodeName === 'SPAN') target = target.parentNode
    if (target && target.nodeName === 'A') {
      let targetId = target.getAttribute('href')
      if (targetId === '#') targetId = 'body'
      removeScrollListener(targetId)
      const header = document.querySelector('.Site-header')
      const style = window.getComputedStyle(header, null)
      const scrollOffset =- header.offsetHeight
      evt.preventDefault()
      setTimeout(() => { 
        scrollToElement(targetId, {
          offset: scrollOffset,
          ease: 'outSine',
          duration: 800
        })
        if (targetId !== 'top') {
          document.querySelector(targetId).focus()
          document.querySelector(targetId).addEventListener('blur', removeTabIndex)
        }
        setTimeout(() => {
          setActiveSection()
          addScrollListener(targetId)
        }, 800)
      }, 200) 
    }
  })

  setActiveSection()
  addScrollListener()
  

  Breakpoint.init(); // initialise breakpoint module

  UpdateCopyrightYear('copyright-year');

  window.onunload = function() {
    console.log('leaving window...');
  };
}

// cutting the mustard (https://www.npmjs.com/package/cut-the-mustard)
// capable browsers only
if (advTest()) {
  atomic_initialise();
}
