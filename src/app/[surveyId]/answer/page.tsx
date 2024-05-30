import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { Survey } from "../../../models/Survey";
import { useParams } from "react-router-dom";
import { SurveyQuestion } from "../../../models/SurveyQuestion";
import { GetVariable, StorageVariable } from "../../../utils/localStorage";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { QuestionType } from "../../../models/Question";
import { QuestionDetails } from "../../../models/QuestionDetails";
import SurveyTitle from "../../../components/surveyTitle";
import { GetQuestion } from "../../../repositories/questionRepo";
import { GetAllVersions } from "../../../repositories/versionRepo";
import LoadingScreen from "../../../components/loadingScreen";
import { SurveyNode } from "../../../models/SurveyNode";
import { GetNextNode, GetRootNode } from "../../../repositories/surveyNodeRepo";

function AnswerSurvey() {
    const params = useParams();
    const surveyId = params.surveyId!;

    const [survey, setSurvey] = useState<Survey | undefined>();
    const [questionOrder, setQuestionOrder] = useState<string[] | undefined>();
    const [surveyQuestions, setSurveyQuestions] = useState<SurveyQuestion[] | undefined>();
    const [currQuestionIdx, setCurrQuestionIdx] = useState(0);
    const [surveyNode, setSurveyNode] = useState<SurveyNode | undefined>();
    const [, setAnswer] = useState("");
    const [answerIndex, setAnswerIndex] = useState(0);

    const GetFirstSurveyNode = useCallback(async function() {
        const root = await GetRootNode(surveyId);

        setSurveyNode(root);
    }, [surveyId]);

    const LoadQuestions = useCallback(async function (selectedProfile: string, existingQuestionOrder: string[]) {
        const loadedQuestions: SurveyQuestion[] = [];

        for (let i = 0; i < existingQuestionOrder.length; i++) {
            const questionId = existingQuestionOrder[i];

            const question = await GetQuestion(surveyId, questionId);

            if (question) {
                let questionDetails: QuestionDetails | undefined = undefined;

                if (question.HasVersions && selectedProfile !== "NoProfile") {
                    const versions = await GetAllVersions(surveyId, questionId);

                    if (versions) {
                        let hasAdded = false;

                        for (let o = 0; o < versions.length; o++) {
                            const version = versions[o];
                            if (version.Profiles.includes(selectedProfile)) {
                                hasAdded = true;
                                questionDetails = version.Details;
                                break;
                            }
                        }

                        if (!hasAdded) {
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

            LoadQuestions(selectedProfile, existingQuestionOrder);
            GetFirstSurveyNode();
        } else {
            window.location.href = `/${surveyId}/start`
        }
    }, [surveyId, LoadQuestions, GetFirstSurveyNode]);

    function ChangeAnswer(e: ChangeEvent<HTMLInputElement>) {
        const target = e.target;
        const value = target.value;

        if(target.type === "radio" || target.type === "check") {
            const tokens = value.split("-");

            setAnswerIndex(parseInt(tokens[0]));

            tokens.splice(0, 1);
            setAnswer(tokens.join("-"));
        } else {
            setAnswerIndex(0);
            setAnswer(value);
        }
    }

    function GetQuestionBody(type: QuestionType, details: QuestionDetails) {
        if (type === QuestionType.SINGLE_CHOICE) {
            return <>
                {
                    details.Answers.map((answer, i) =>
                        <>
                            <Form.Check onChange={ChangeAnswer} required key={`${currQuestionIdx}-${i}`} type="radio" name="answers" value={`${i}-${answer}`} label={answer}></Form.Check>
                        </>
                    )
                }
            </>;
        } else if (type === QuestionType.MULTIPLE_CHOICE) {
            return <>
                {
                    details.Answers.map((answer, i) =>
                        <>
                            <Form.Check onChange={ChangeAnswer} key={`${currQuestionIdx}-${i}`} type="checkbox" name="answers" value={`${i}-${answer}`} label={answer}></Form.Check>
                        </>
                    )
                }
            </>;
        } else if (type === QuestionType.FREE_TEXT) {
            return <Form.Control onChange={ChangeAnswer} key={`${currQuestionIdx}`} type="text" required placeholder="Introduzca su respuesta"></Form.Control>;
        } else if (type === QuestionType.DATE) {
            return <Form.Control onChange={ChangeAnswer} key={`${currQuestionIdx}`} required type="date"></Form.Control>
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
                                details.Answers.map((answer, i) =>
                                    <Col className="m-0 p-0 text-center">
                                        <Form.Check onChange={ChangeAnswer} required key={`${currQuestionIdx}-${i}`} id={`${currQuestionIdx}-${i}`} type="radio" name="answers" value={`${i}-${answer}`}></Form.Check>
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

    async function NextQuestion() {
        if(!surveyNode) { return; }
        
        const newNode = await GetNextNode(surveyId, surveyNode.ID, answerIndex);
        setSurveyNode(newNode);

        setCurrQuestionIdx(currQuestionIdx + 1);
        setAnswer("");
        setAnswerIndex(0);
    }

    function SaveAndContinue(e: FormEvent) {
        e.preventDefault();

        // TODO: Store the info or whatever

        NextQuestion();
    }

    function Skip() {
        NextQuestion();
    }

    let surveyQuestion: SurveyQuestion | undefined = undefined;
    if (surveyNode) {
        surveyQuestion = surveyQuestions?.find(x => x.ID === surveyNode.QuestionId);
    }

    return <>
        {
            survey && questionOrder && surveyQuestions ?
                <>
                    <SurveyTitle title={survey.Title}></SurveyTitle>

                    <main>
                        {
                            surveyQuestion ?
                                <Form onSubmit={SaveAndContinue}>
                                    <Form.Label className="question-title mb-3">{surveyQuestion.Details.Title}</Form.Label>

                                    {GetQuestionBody(surveyQuestion.QuestionType, surveyQuestion.Details)}

                                    <div className="mt-5">
                                        <Button className="mt-2" type="submit" variant="secondary">Continuar</Button>
                                        <Button onClick={Skip} className="mt-2 skip-button" type="button" variant="secondary">Saltar</Button>
                                    </div>
                                </Form>
                                :
                                <main>
                                    <LoadingScreen title="Cargando siguiente pregunta..."></LoadingScreen>
                                </main>
                        }
                    </main>
                </>
                :
                <main>
                    <LoadingScreen></LoadingScreen>
                </main>
        }
    </>;
}

export default AnswerSurvey;