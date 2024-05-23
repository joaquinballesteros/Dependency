import { FormEvent, useCallback, useEffect, useState } from "react";
import { Survey } from "../../../models/Survey";
import { useParams } from "react-router-dom";
import { SurveyQuestion } from "../../../models/SurveyQuestion";
import { GetVariable, StorageVariable } from "../../../utils/localStorage";
import { Button, Form, Spinner } from "react-bootstrap";
import { QuestionType } from "../../../models/Question";
import { QuestionDetails } from "../../../models/QuestionDetails";
import SurveyTitle from "../../../components/surveyTitle";

function AnswerSurvey() {
    const params = useParams();
    const surveyId = params.surveyId!;

    const [survey, setSurvey] = useState<Survey|undefined>();
    const [questionOrder, setQuestionOrder] = useState<string[]|undefined>();
    const [surveyQuestions, setSurveyQuestions] = useState<SurveyQuestion[]|undefined>();
    const [currQuestionIdx, setCurrQuestionIdx] = useState(0);
    const [surveyQuestion, setSurveyQuestion] = useState<SurveyQuestion|undefined>();

    const GetCurrentQuestion = useCallback(function(questionOrder: string[], surveyQuestions: SurveyQuestion[]) {
        const id = questionOrder[currQuestionIdx];
        return surveyQuestions.find(x => x.ID === id)!;
    }, [currQuestionIdx]);

    useEffect(() => {
        const existingSurvey = GetVariable<Survey>(StorageVariable.SURVEY_INFO);
        const existingQuestionOrder = GetVariable<string[]>(StorageVariable.QUESTION_ORDER);
        const existingSurveyQuestions = GetVariable<SurveyQuestion[]>(StorageVariable.SURVEY_QUESTIONS);

        if(existingSurvey && existingSurvey.ID === surveyId && existingQuestionOrder && existingSurveyQuestions) {
            setSurvey(existingSurvey);
            setQuestionOrder(existingQuestionOrder);
            setSurveyQuestions(existingSurveyQuestions);
            setSurveyQuestion(GetCurrentQuestion(existingQuestionOrder, existingSurveyQuestions));
        } else {
            window.location.href = `/${surveyId}/start`
        }
    }, [surveyId, GetCurrentQuestion]);
    

    function GetQuestionBody(type: QuestionType, details: QuestionDetails) {
        if(type === QuestionType.SINGLE_CHOICE) {
            return <>
                {
                    details.Answers.map((answer, i) => 
                        <>
                            <Form.Check required key={`${currQuestionIdx}-${i}`} type="radio" name="answers" value={i.toString()} label={answer}></Form.Check>
                        </>
                    )
                }
            </>;
        } else if(type === QuestionType.MULTIPLE_CHOICE) {
            return <>
                {
                    details.Answers.map((answer, i) => 
                        <>
                            <Form.Check key={`${currQuestionIdx}-${i}`} type="checkbox" name="answers" value={i.toString()} label={answer}></Form.Check>
                        </>
                    )
                }
            </>;
        } else if(type === QuestionType.FREE_TEXT) {
            return <Form.Control key={`${currQuestionIdx}`} type="text" required placeholder="Introduzca su respuesta"></Form.Control>;
        } else if(type === QuestionType.DATE) {
            return <Form.Control key={`${currQuestionIdx}`} required type="date"></Form.Control>
        }

        return <p>Tipo de pregunta no soportada</p>
    }

    function NextQuestion() {
        setCurrQuestionIdx(currQuestionIdx + 1);
    }

    function SaveAndContinue(e: FormEvent) {
        e.preventDefault();

        NextQuestion();
    }

    return <>
        {
            survey && questionOrder && surveyQuestions && surveyQuestion?
            <>
                <SurveyTitle title={survey.Title}></SurveyTitle>

                <main>
                    <Form onSubmit={SaveAndContinue}>
                        <Form.Label>{surveyQuestion.Details.Title}</Form.Label>

                        {GetQuestionBody(surveyQuestion.QuestionType, surveyQuestion.Details)}

                        <Button className="mt-2" type="submit" variant="secondary">Continuar</Button>
                        <Button className="mt-2 skip-button" type="button" variant="secondary">Saltar</Button>
                    </Form>
                </main>
            </>
            :
            <Spinner></Spinner>
        }
    </>;
}

export default AnswerSurvey;