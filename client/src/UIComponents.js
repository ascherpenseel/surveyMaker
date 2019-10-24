import React from 'react';

export function UIQuestionForm (props) {
  return (
    <div className="uiQuestionForm">
      <div>Insert a new question</div>
      <form onSubmit={props.onSubmit}>
        <textarea name="text" maxLength="300"></textarea>
        <div className="answerType">
          <input className="typeText" type="radio" name="type" value="text" defaultChecked="true"/> Text answer
          <input className="typeLikert" type="radio" name="type" value="likert"/> Likert scale answer
          <div className="likertTexts">
            <input name="likert1" type="text" placeholder="Strongly disagree"></input>
            <input name="likert2" type="text" placeholder="Disagree"></input>
            <input name="likert3" type="text" placeholder="Indifferent"></input>
            <input name="likert4" type="text" placeholder="Agree"></input>
            <input name="likert5" type="text" placeholder="Strongly agree"></input>
          </div>
        </div>
        <div className="btnContainer">
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
  );
}

export function UIQuestionsList (props) {
  return (
    <ul className="uiQuestionsList">
      {props.list.map((question, index) => (
        <li key={index}>
          <div className="questionText">{question.text}</div>
          <div className="answerType">{question.type}</div>
        </li>
      ))}
    </ul>
  );
}

export function UIQuestion (props) {
  return (
    <div className="uiQuestion" data-type={props.question.type}>
      <p>{props.question.text}</p>
      {props.question.type === "text" && (
        <textarea maxLength="300"></textarea>
      )}
      {props.question.type === "likert" && (
        <div className="likertScale">
          <label className="likertContainer">
            <input type="radio" name={"radio"+props.index} data-index="0"/>
            <span className="likert">{props.question.likert[0]}</span>
          </label>
          <label className="likertContainer">
            <input type="radio" name={"radio"+props.index} data-index="1"/>
            <span className="likert">{props.question.likert[1]}</span>
          </label>
          <label className="likertContainer">
            <input type="radio" name={"radio"+props.index} data-index="2"/>
            <span className="likert">{props.question.likert[2]}</span>
          </label>
          <label className="likertContainer">
            <input type="radio" name={"radio"+props.index} data-index="3"/>
            <span className="likert">{props.question.likert[3]}</span>
          </label>
          <label className="likertContainer">
            <input type="radio" name={"radio"+props.index} data-index="4"/>
            <span className="likert">{props.question.likert[4]}</span>
          </label>
        </div>
      )}
    </div>
  );
}

export function UIQuestionResults (props) {
  return (
    <div className="uiQuestionResults">
      <p>{props.question.text}</p>
      { props.question.type === "text" && (
        <UITextAnswers answers={props.question.answers}/>
      )}
      { props.question.type === "likert" && (
        <UILikertAnswers answers={props.question.answers}/> 
      )}
    </div>
  );
}

export function UITextAnswers (props) {
  return (
    <div className="uiTextAnswers">
      {props.answers.map((answer, index) => (
        <div className={index % 2 === 0 ? "even" : "odd"} key={index}>
          { answer.text }
        </div>
      ))}
    </div>
  );
}

export function UILikertAnswers (props) {
  return (
    <div className="uiLikertAnswers" data-count={props.answers.length}>
      <div className="likertBar1">{props.answers.filter(answer => answer.likert === "0").length}</div>
      <div className="likertBar2">{props.answers.filter(answer => answer.likert === "1").length}</div>
      <div className="likertBar3">{props.answers.filter(answer => answer.likert === "2").length}</div>
      <div className="likertBar4">{props.answers.filter(answer => answer.likert === "3").length}</div>
      <div className="likertBar5">{props.answers.filter(answer => answer.likert === "4").length}</div>
    </div>
  );
}

export function UIResponses (props) {
  return (
    <table className="uiResponses">
      <thead>
        <tr>
          <th>Email</th>
          <th>Question</th>
          <th>Answer</th>
        </tr>
      </thead>
      <tbody>
        {props.data.map(email => email[1].map((x, index) => (
          <tr key={index}>
            <td data-email={email[0]}>{email[0] !== "null" ? email[0] : <i>anonymous</i>}</td>
            <td>{x.question}</td>
            <td>{x.answer}</td>
          </tr>
        )))}
      </tbody>      
    </table>
  );
}
