var express = require('express');
var router = express.Router();
const fs = require('fs');

router.post('/survey', function(req, res) {
  
  const newQuestions = req.body.questions;
  let newSurvey = req.body.survey;

  // Read current files
  let fileSurveys = require('../db/surveys.json');
  let fileQuestions = require('../db/questions.json');

  // Edit files
  let initIndex = fileQuestions.count;
  let newQuestionsIndexes = Array.from(Array(newQuestions.length), (x,index) => index + initIndex);
  fileQuestions.count += newQuestions.length;
  fileQuestions.questions.push(...newQuestions);
  newSurvey.questions.push(...newQuestionsIndexes);
  fileSurveys.count ++;
  fileSurveys.surveys.push(newSurvey);

  // Write edited files
  const jsonStringSurveys = JSON.stringify(fileSurveys);
  const jsonStringQuestions = JSON.stringify(fileQuestions);
  fs.writeFileSync('./db/questions.json', jsonStringQuestions);
  fs.writeFileSync('./db/surveys.json', jsonStringSurveys);
  
  // Send back the id of the new survey
  res.setHeader('Content-Type', 'application/json');
  res.send({ id: fileSurveys.count - 1 });

});

router.get('/questions/:id', function(req, res) {
  
  const surveyID = req.params.id;

  // Read current files
  const fileSurveys = require('../db/surveys.json');
  const fileQuestions = require('../db/questions.json');

  // Select * from questions where question.id belongs to surveys[surveyId].questions
  const questionIDs = fileSurveys.surveys[surveyID].questions;
  let questions = questionIDs.map(index => fileQuestions.questions[index]);

  // Send back the array of selected questions
  res.setHeader('Content-Type','application/json');
  res.send({ data: questions });

});

router.post('/answer', function(req, res) {

  const surveyID = req.body.surveyID;
  const newAnswers = req.body.answers;

  // Read current files
  const fileSurveys = require('../db/surveys.json');
  const fileQuestions = require('../db/questions.json');
  const fileAnswers = require('../db/answers.json');

  // Edit files
  let initIndex = fileAnswers.count;
  let newAnswersIndexes = Array.from(Array(newAnswers.length), (x,index) => index + initIndex);
  fileAnswers.count += newAnswers.length;
  fileAnswers.answers.push(...newAnswers);

  const questionIDs = fileSurveys.surveys[surveyID].questions;
  for (let i=0; i<questionIDs.length; i++) {
    fileQuestions.questions[questionIDs[i]].answers.push(newAnswersIndexes[i]);
  }
  
  // Write files
  const jsonStringQuestions = JSON.stringify(fileQuestions);
  const jsonStringAnswers = JSON.stringify(fileAnswers);
  fs.writeFileSync('./db/answers.json', jsonStringAnswers);
  fs.writeFileSync('./db/questions.json', jsonStringQuestions);

  res.end();

});

router.get('/results/:id', function(req, res) {

  const surveyID = req.params.id;
  let survey, questions, answers;

  // Read current files
  const fileSurveys = require('../db/surveys.json');
  const fileQuestions = require('../db/questions.json');
  const fileAnswers = require('../db/answers.json');

  // Select the survey data
  survey = fileSurveys.surveys[surveyID];
  questions = survey.questions.map(i => fileQuestions.questions[i]);
  answers = questions.map(q => q.answers).map( subarray => subarray.map( answerIndex => fileAnswers.answers[answerIndex] ) );

  // Send back the survey data
  res.setHeader('Content-Type','application/json');
  res.send({ survey, questions, answers });
});

module.exports = router;
