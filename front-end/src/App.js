import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';

import About from './components/About';
import Contact from './components/Contact';
import BlogCategories from './components/BlogCategories';
import BlogCategory from './components/BlogCategory';
import Blog from './components/Blog';
import CreativeProgrammingList from './components/CreativeProgrammingList';
import CreativeProgrammingDisplay from './components/CreativeProgrammingDisplay';
import Header1 from './components/Header1';
import Footer1 from './components/Footer1';





function App() {
  return (

    <div className="root-container">

      <Router>
        <Header />
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/about" component={About} />
          <Route path="/contactme" component={Contact} />
          <Route path="/blogCategories" component={BlogCategories} exact />
          <Route path="/blogCategories/:id" component={BlogCategory} />
          <Route path="/blogs/:id" component={Blog} />
          <Route path="/creativeProgramming" component={CreativeProgrammingList} exact />
          <Route path="/creativeProgramming/:id" component={CreativeProgrammingDisplay} />
        </Switch>
        <Footer />

      </Router>
    </div>

  );
}

export default App;
