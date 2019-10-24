import React from 'react';
import { UIQuestionForm, UIQuestionsList } from './UIComponents';
import * as Model from './Model';
import './styles/SurveyCreate.scss';

class SurveyCreate extends React.Component {
  
  constructor (props) {
    super(props);
    this.state = {
      questions: [],
      published: false,
      answerUrl: '',
      resultsUrl: '' 
    };
  }

  addQuestion (event) {
    event.preventDefault();
    const data      = new FormData(event.target),
          text      = data.get('text'),
          type      = data.get('type');
    
    let likert = [1,2,3,4,5].map((n) => data.get(`likert${n}`));
    event.target.reset();

    let question = new Model.Question(text, type, likert);
    this.setState({
      questions: this.state.questions.concat(question)
    });
  }

  deleteQuestion (event) {
    const index = event.target.parentElement.getAttribute('index');
    let newQuestions = this.state.questions;
    newQuestions.splice(index,1);
    this.setState({
      questions: newQuestions
    })
  }

  publish () {
    let component = this;
    let newSurvey = new Model.Survey();
    let data = {
      survey: newSurvey,
      questions: component.state.questions
    }
    fetch('http://localhost:9000/survey',{
      method: 'POST',
      body: JSON.stringify(data),
      headers: {"Content-Type": "application/json"}
    }).then(function(response){
      return response.json();
    }).then(function(response) {
      let surveyID = response.id;
      component.setState({
        answerUrl: `/answer/${surveyID}`,
        resultsUrl: `/results/${surveyID}`,
        published: true
      });
    });
  }

  render () {
    return (
      <div className="surveyCreate">
        <h1>Create a new survey</h1>
          {this.state.published && (
            <div className="successMessage">
              <p>Your survey was created succesfully =)</p>
              <p>Send this <a href={this.state.answerUrl} target="_blank" rel="noopener noreferrer">link</a> to your audience so they can start filling it out.</p>
              <p>Check the survey results <a href={this.state.resultsUrl} target="_blank" rel="noopener noreferrer">here</a></p>
            </div>
          )}
          {!this.state.published && (
            <div className="surveyMaker">
              <UIQuestionForm onSubmit={this.addQuestion.bind(this)}/>
              <UIQuestionsList list={this.state.questions} onClick={this.deleteQuestion.bind(this)}/>
              <div className="btnContainer">
                <button className="publishBtn" onClick={this.publish.bind(this)}>Publish</button>
              </div>
            </div>
          )}
      </div>
    );
  }
}

export default SurveyCreate;
