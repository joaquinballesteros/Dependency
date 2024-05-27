import { FormEvent, useCallback, useEffect, useState } from "react";
import { Survey } from "../../../models/Survey";
import { useParams } from "react-router-dom";
import { SurveyQuestion } from "../../../models/SurveyQuestion";
import { GetVariable, StorageVariable } from "../../../utils/localStorage";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { QuestionType } from "../../../models/Question";
import { QuestionDetails } from "../../../models/QuestionDetails";
import SurveyTitle from "../../../components/surveyTitle";
import { GetQuestion } from "../../../repositories/questionRepo";
import { GetAllVersions } from "../../../repositories/versionRepo";

function AnswerSurvey() {
    const params = useParams();
    const surveyId = params.surveyId!;

    const [survey, setSurvey] = useState<Survey | undefined>();
    const [questionOrder, setQuestionOrder] = useState<string[] | undefined>();
    const [surveyQuestions, setSurveyQuestions] = useState<SurveyQuestion[] | undefined>();
    const [currQuestionIdx, setCurrQuestionIdx] = useState(0);

    const LoadQuestions = useCallback(async function(order: string[], selectedProfile: string){
        const loadedQuestions: SurveyQuestion[] = [];

        for (let i = 0; i < order.length; i++) {
            const questionId = order[i];
            
            const question = await GetQuestion(surveyId, questionId);

            if(question) {
                let questionDetails: QuestionDetails|undefined = undefined;

                if(question.HasVersions && selectedProfile !== "NoProfile") {
                    const versions = await GetAllVersions(surveyId, questionId);

                    if(versions) {
                        let hasAdded = false;

                        for (let o = 0; o < versions.length; o++) {
                            const version = versions[o];
                            if(version.Profiles.includes(selectedProfile)) {
                                hasAdded = true;
                                questionDetails = version.Details;
                                break;
                            }
                        }

                        if(!hasAdded) {
                            questionDetails = question.DefaultDetails;
                        }
                    }
                } else {
                    questionDetails = question.DefaultDetails;
                }

                loadedQuestions.push({
                    ID: question.ID!,
                    QuestionType: question.QuestionType,
                    Details: questionDetails!
                });

                console.log("Loaded " + question.ID)
                setSurveyQuestions([...loadedQuestions]);
            }
        }
    }, [surveyId]);

    useEffect(() => {
        const existingSurvey = GetVariable<Survey>(StorageVariable.SURVEY_INFO);
        const existingQuestionOrder = GetVariable<string[]>(StorageVariable.QUESTION_ORDER);
        const selectedProfile = GetVariable<string>(StorageVariable.SELECTED_PROFILE);

        if (existingSurvey && existingSurvey.ID === surveyId && existingQuestionOrder && selectedProfile) {
            setSurvey(existingSurvey);
            setQuestionOrder(existingQuestionOrder);

            LoadQuestions(existingQuestionOrder, selectedProfile);
        } else {
            window.location.href = `/${surveyId}/start`
        }
    }, [surveyId, LoadQuestions]);

    function GetQuestionBody(type: QuestionType, details: QuestionDetails) {
        if (type === QuestionType.SINGLE_CHOICE) {
            return <>
                {
                    details.Answers.map((answer, i) =>
                        <>
                            <Form.Check required key={`${currQuestionIdx}-${i}`} type="radio" name="answers" value={i.toString()} label={answer}></Form.Check>
                        </>
                    )
                }
            </>;
        } else if (type === QuestionType.MULTIPLE_CHOICE) {
            return <>
                {
                    details.Answers.map((answer, i) =>
                        <>
                            <Form.Check key={`${currQuestionIdx}-${i}`} type="checkbox" name="answers" value={i.toString()} label={answer}></Form.Check>
                        </>
                    )
                }
            </>;
        } else if (type === QuestionType.FREE_TEXT) {
            return <Form.Control key={`${currQuestionIdx}`} type="text" required placeholder="Introduzca su respuesta"></Form.Control>;
        } else if (type === QuestionType.DATE) {
            return <Form.Control key={`${currQuestionIdx}`} required type="date"></Form.Control>
        } else if (type === QuestionType.RANGE) {
            return <Container className="m-0 p-0 numeric-range-container">
                <Row className="m-0 p-0">
                    <Col className="m-0 p-0 text-center">
                        {details.First}
                    </Col>

                    <Col className="m-0 p-0 col-8">
                        <Row className="m-0 p-0">
                            {
                                details.Answers.map((_, i) =>
                                    <Col className="m-0 p-0 text-center">
                                        <Form.Label key={`${currQuestionIdx}-${i}`} htmlFor={`${currQuestionIdx}-${i}`}>{i + 1}</Form.Label>
                                    </Col>
                                )
                            }
                        </Row>

                        <Row className="m-0 p-0">
                            {
                                details.Answers.map((_, i) =>
                                    <Col className="m-0 p-0 text-center">
                                        <Form.Check required key={`${currQuestionIdx}-${i}`} id={`${currQuestionIdx}-${i}`} type="radio" name="answers" value={i.toString()}></Form.Check>
                                    </Col>
                                )
                            }
                        </Row>
                    </Col>

                    <Col className="m-0 p-0 text-center">
                        {details.Last}
                    </Col>
                </Row>
            </Container>
        }

        return <p>Tipo de pregunta no soportada</p>
    }

    function NextQuestion() {
        setCurrQuestionIdx(currQuestionIdx + 1);
    }

    function SaveAndContinue(e: FormEvent) {
        e.preventDefault();

        //TODO: Actually save the results somewhere

        NextQuestion();
    }

    function Skip() {
        NextQuestion();
    }

    let surveyQuestion: SurveyQuestion|undefined = undefined;
    if(questionOrder) {
        const questionId = questionOrder[currQuestionIdx];

        surveyQuestion = surveyQuestions?.find(x => x.ID === questionId);
    }

    return <>
        {
            survey && questionOrder && surveyQuestions?
                <>
                    <SurveyTitle title={survey.Title}></SurveyTitle>

                    <main>
                    {
                        surveyQuestion?
                        <Form onSubmit={SaveAndContinue}>
                            <Form.Label className="question-title mb-3">{surveyQuestion.Details.Title}</Form.Label>

                            {GetQuestionBody(surveyQuestion.QuestionType, surveyQuestion.Details)}

                            <div className="mt-5">
                                <Button className="mt-2" type="submit" variant="secondary">Continuar</Button>
                                <Button onClick={Skip} className="mt-2 skip-button" type="button" variant="secondary">Saltar</Button>
                            </div>
                        </Form>
                        :
                        <Spinner></Spinner>
                    }
                    </main>
                </>
                :
                <Spinner></Spinner>
        }
    </>;
}

export default AnswerSurvey;