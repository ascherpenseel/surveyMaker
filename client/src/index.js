import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import './styles/index.css';
import SurveyCreate from './SurveyCreate';
import SurveyAnswer from './SurveyAnswer';
import SurveyResults from './SurveyResults';


const routing = (
    <Router>
        <div>
            <Route exact path="/" component={SurveyCreate} />
            <Route path="/answer/:id" component={SurveyAnswer} />
            <Route path="/results/:id" component={SurveyResults} />
        </div>
    </Router>
);

ReactDOM.render(routing, document.getElementById('root'));


