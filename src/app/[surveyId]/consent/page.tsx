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

    // function OnClickYes() {
    //     window.location.href = `/${surveyId}/selectProfile`;
    // }

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
                        <h2>Política de Privacidad</h2>
                        <p>
                            Apreciamos su participación en nuestra encuesta y queremos asegurarle que la privacidad
                            y la seguridad de sus respuestas son nuestra máxima prioridad. Todas sus respuestas serán
                            completamente anónimas y no las recolectamos de ninguna manera.
                        </p>

                        <p>
                            Gracias por su colaboración.
                        </p>

                        <Container className="yesno-container">
                            <Row>
                                {/* 
                                Commented for the moment, since we don't store data yet

                                <Col>
                                    <Button className="yesno-btn me-4" onClick={OnClickYes} disabled variant="secondary">Sí</Button>
                                </Col> */}

                                <Col>
                                    <Button className="yesno-btn" onClick={OnClickNo} variant="secondary">Continuar</Button>
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