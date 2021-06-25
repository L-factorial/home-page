import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';

import About from './components/About';
import BlogCategories1 from './components/BlogCategories1';
import BlogCategory from './components/BlogCategory';
import Blog from './components/Blog';
import CreativeProgrammingList from './components/CreativeProgrammingList';
import CreativeProgrammingDisplay from './components/CreativeProgrammingDisplay';
import Projects from './components/Projects'


function App() {
  return (

    <div className="root-container">

      <Router>
        <Header />
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/about" component={About} />
          <Route path="/blogCategories" component={BlogCategories1} exact />
          <Route path="/blogCategories/:id" component={BlogCategory} />
          <Route path="/blogs/:id" component={Blog} />
          <Route path="/creativeProgramming" component={CreativeProgrammingList} exact />
          <Route path="/creativeProgramming/:id" component={CreativeProgrammingDisplay} />
          <Route path="/projects" component={Projects} />

        </Switch>
        <Footer />

      </Router>
    </div>

  );
}

export default App;
