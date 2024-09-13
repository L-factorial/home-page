
import './App1.css';
import Header from './components-new-design/Header'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components-new-design/Home';
import About from './components-new-design/About';
import Blog from './components-new-design/Blog';
import Projects from './components-new-design/Projects'
import NotFound from './components-new-design/NotFound';
import KathmanduUniversity from './components-new-design/KathmanduUniversity';
import BlogListByCategory from './components-new-design/BlogListByCategory';

function App() {
  return (
    <div className="root-container">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/home" element={<Home />} exact />
          <Route path="/about" element={<About />} exact />
          <Route path="/kathmanduUniversity" element={<KathmanduUniversity />} exact />

          <Route path="/blogListByCategory/:category" element={<BlogListByCategory />} exact/>
          <Route path="/blog/:category/:id" element={<Blog />} exact/>

          <Route path="/projects" element={<Projects />} exact />
          <Route element={<NotFound />} />
        </Routes>
      </Router>
    </div>

  );
}

export default App;
