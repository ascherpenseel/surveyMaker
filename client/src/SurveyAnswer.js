import React from 'react';
import './styles/SurveyAnswer.scss';
import * as Model from './Model';
import { UIQuestion } from './UIComponents';

class SurveyAnswer extends React.Component {
  
  constructor (props) {
    super(props);
    this.state = { 
      survey: new Model.Survey(this.props.match.params.id),
      questions: [],
      email: null,
      sent: false
    };
  }

  componentDidMount () {
    this.getSurvey(this.state.survey.id);
  }

  getSurvey (id) {
    let component = this;
    let queryURL = `http://localhost:9000/questions/${id}`;

    fetch(queryURL,{
      method: 'GET'
    }).then(function(response) {
      return response.json();
    }).then(function(response) {
      let responseQuestions = response.data.map(q => new Model.Question(q.text, q.type, q.likert));
      component.setState({
        questions: component.state.questions.concat(responseQuestions)
      });
    }).catch(function(err){
      alert(`Something went wrong when retrieving the survey. Please check your api server is working and try again. \n>Error: ${err}`);
    });
  }

  collectAnswers () {
    let questionElements = document.querySelectorAll('div.uiQuestion'),
        email = document.querySelector('.surveyAnswer .email').value,
        answers = [];

    for (let questionEl of questionElements) {
      let type = questionEl.getAttribute('data-type');
      let answer = new Model.Answer(type);
      answer.setEmail(email);
      switch (answer.type) {
        case "text":
          let text = questionEl.querySelector('textarea').value;
          answer.setText(text);
          break;
        case "likert":
          let likert = questionEl.querySelector('input:checked').getAttribute('data-index');
          answer.setLikert(likert);
          break;
        default:
          throw new Error('Unsupported answer type');
      }
      answers.push(answer);
    }

    return answers;
  }

  sendAnswers () {
    let component = this,
        answers = this.collectAnswers(),
        queryURL = "http://localhost:9000/answer";

    fetch(queryURL,{
      method: 'POST',
      body: JSON.stringify({ answers: answers, surveyID : component.state.survey.id }),
      headers: {"Content-Type": "application/json"}
    }).then(function(response){
      component.closeSurvey();
      return;
    }).catch(function(err){
      alert(`Something went wrong when saving your answers. Please check your api server is working and try again. \n>Error: ${err}`);
    });
  }

  closeSurvey () {
    this.setState({
      sent: true
    })
  }

  render () {
    return (
      <div className="surveyAnswer">
        <h1>Could you answer this survey?</h1>
        {this.state.sent && (
          <div className="successMessage">
            <p>Your survey was sent! Thank you for taking your time =)</p>
          </div>
        )}
        {!this.state.sent && ( 
          <div className="surveyFill">
            {this.state.questions.map((question, index) => (
              <UIQuestion key={index} question={question} index={index}/>
            ))}
            <div className="btnContainer">
              <input className="email" placeholder="Your email (optional)"/>
              <button className="sendBtn" onClick={this.sendAnswers.bind(this)}>Send</button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default SurveyAnswer;
