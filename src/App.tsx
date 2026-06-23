import LoadingScreen from './components/LoadingScreen';
import StatusBar from './components/StatusBar';
import Hero from './components/Hero';
import Dock from './components/Dock';
import WhatIDo from './components/WhatIDo';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';

const SECTIONS = [
  { id: 'hero',      glyph: '~',  label: 'whoami' },
  { id: 'projects',  glyph: '/',  label: 'build' },
  { id: 'work',      glyph: '#',  label: 'work' },
  { id: 'skills',    glyph: '*',  label: 'toolkit' },
  { id: 'contact',   glyph: '@',  label: 'contact' },
];

export default function App() {
  return (
    <>
      <StatusBar />
      <LoadingScreen />
      <Hero />
      <WhatIDo />
      <Projects />
      <Experience />
      <Skills />
      <Education />
      <Contact />
      <Footer />
      <Dock items={SECTIONS} />
    </>
  );
}
