import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';

import About from './components/About';
import BlogCategories from './components/BlogCategories';
import Blog from './components/Blog';
import CreativeProgrammingList from './components/CreativeProgrammingList';
import CreativeProgrammingDisplay from './components/CreativeProgrammingDisplay';
import Projects from './components/Projects'
import NotFound from './components/NotFound';
import KathmanduUniversity from './components/KathmanduUniversity';

function App() {
  return (
    <div className="root-container">
      <Router>
        <Header />
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/about" component={About} exact />
          <Route path="/kathmanduUniversity" component={KathmanduUniversity} exact />

          <Route path="/blogCategories" component={BlogCategories} exact />
          <Route path="/blog/:id" component={Blog} exact/>
          <Route path="/creativeProgramming" component={CreativeProgrammingList} exact />
          <Route path="/creativeProgramming/:id" component={CreativeProgrammingDisplay} exact />
          <Route path="/projects" component={Projects} exact />
          <Route component={NotFound} />
        </Switch>
        <Footer />

      </Router>
    </div>

  );
}

export default App;
