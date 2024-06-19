import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Survey } from "../../../models/Survey";
import { GetVariable, SetVariable, StorageVariable } from "../../../utils/localStorage";
import LoadingScreen from "../../../components/loadingScreen";
import SurveyTitle from "../../../components/surveyTitle";
import { Button, Col, Container, Row } from "react-bootstrap";

function AskConsent() {
    const params = useParams();
    const surveyId = params.surveyId!;

    const [survey, setSurvey] = useState<Survey | undefined>();

    useEffect(() => {
        const existingSurvey = GetVariable<Survey>(StorageVariable.SURVEY_INFO);

        if (existingSurvey && existingSurvey.ID === surveyId) {
            setSurvey(existingSurvey);
        } else {
            window.location.href = `/${surveyId}/start`
        }
    }, [surveyId]);

    function OnClickYes() {
        window.location.href = `/${surveyId}/selectProfile`;
    }

    function OnClickNo() {
        SetVariable(StorageVariable.SELECTED_PROFILE, "NoProfile");
        SetVariable(StorageVariable.CURRENT_NODE, null);
        SetVariable(StorageVariable.TRAVERSED_NODES, null);

        window.location.href = `/${surveyId}/answer`;
    }

    return <>
        {
            survey ?
                <>
                    <SurveyTitle title={survey.Title}></SurveyTitle>

                    <main>
                        <h2>¿Permitir que se recopilen las respuestas?</h2>
                        <p>
                            Antes de comenzar la encuesta, nos gustaría pedir su consentimiento
                            para recopilar y utilizar sus respuestas. Si acepta, le haremos algunas
                            preguntas personales antes de comenzar y utilizaremos sus datos y
                            respuestas para mejorar la calidad de la encuesta y la precisión de los resultados.
                            La participación es voluntaria y sus respuestas serán tratadas con confidencialidad.
                        </p>

                        <p>
                            Por el momento la opción de recopilar datos no está disponible.
                        </p>

                        <Container className="yesno-container">
                            <Row>
                                <Col>
                                    <Button className="yesno-btn me-4" onClick={OnClickYes} disabled variant="secondary">Sí</Button>
                                </Col>

                                <Col>
                                    <Button className="yesno-btn" onClick={OnClickNo} variant="danger">No</Button>
                                </Col>
                            </Row>
                        </Container>
                    </main>
                </>
                :
                <main>
                    <LoadingScreen></LoadingScreen>
                </main>
        }
    </>;
}

export default AskConsent;