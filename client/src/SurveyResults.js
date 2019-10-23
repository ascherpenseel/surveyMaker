import React from 'react';
import './styles/SurveyResults.scss';
import * as Model from './Model';
import { UIQuestionResults, UIResponses } from './UIComponents';

class SurveyResults extends React.Component {
  
  constructor (props) {
    super(props);
    this.state = {
      responsesCount: 0,
      responsesTable: [],
      survey: new Model.Survey(this.props.match.params.id)
    };
  }

  componentDidMount () {
    this.getSurveyResults(this.state.survey.id);
  }

  componentDidUpdate () {
    // Merge emails with rowspans
    for (let email of this.state.responsesTable) {
      let tds = document.querySelectorAll(`td[data-email="${email[0]}"]`);
      tds = Array.from(tds);
      tds[0].setAttribute('rowspan',tds.length); 
      tds.shift();
      tds.forEach(x => {x.remove()});
    }

    // Set summary bars' height
    const likertAnswers = document.querySelectorAll('.uiLikertAnswers');
    const maxH = 150;
    for (let answerEl of likertAnswers) {
      const count = answerEl.getAttribute('data-count');
      for (let bar of answerEl.children) {
        let newH = maxH * parseInt(bar.textContent) / count;
        bar.style.height = `${newH}px`;
      }
    }
  }

  getSurveyResults (surveyID) {
    let component = this;
    let queryURL = `http://localhost:9000/results/${surveyID}`;
    let surveyResults = new Model.Survey(surveyID);

    fetch(queryURL, {
      method: 'GET'
    }).then(function(response) {
      return response.json();
    }).then(function(response) {
      // Build up the surveyResults object
      for (let i=0; i<response.questions.length; i++) {
        let el = response.questions[i];
        let question = new Model.Question(el.text, el.type, el.likert);
        for (let j=0; j<response.answers[i].length; j++) {
          let answer = new Model.Answer(response.answers[i][j].type);
          answer.type === "text" && answer.setText(response.answers[i][j].text);
          answer.type === "likert" && answer.setLikert(response.answers[i][j].likert);
          response.answers[i][j].email && answer.setEmail(response.answers[i][j].email);
          question.answers.push(answer);
        }
        surveyResults.questions.push(question);
      }
      
      let responsesCount = Math.max(...(surveyResults.questions.map(q => q.answers.length)));
      let responsesTable = {};
      for (let question of surveyResults.questions) {
        for (let answer of question.answers) {
          if (!responsesTable[answer.email]) responsesTable[answer.email] = [];
          let response = {
            question: question.text
          };
          switch (answer.type) {
            case 'text':
              response.answer = answer.text;
              break;
            case 'likert':
              response.answer = question.likert[answer.likert];
              break;
            default:
              console.error('Incorrect answer type in results');
          }
          responsesTable[answer.email].push(response);
        }
      }
      responsesTable = Object.entries(responsesTable);
      
      // Set state
      component.setState({
        survey: surveyResults,
        responsesCount: responsesCount,
        responsesTable: responsesTable
      });
    });
  }

  render () {
    return (
      <div className="surveyResults">
        <h1>Survey summary</h1>
        <div className="surveySummary">
          {this.state.survey.questions.map((question, index) => (
            <UIQuestionResults key={index} question={question}/>
          ))}
        </div>
        <h1>Responses ({this.state.responsesCount})</h1>
        <div className="surveyResponses">
          <UIResponses data={this.state.responsesTable}/>
        </div>
      </div>
    );
  }
}

export default SurveyResults;
