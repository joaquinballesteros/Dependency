import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Survey } from "../../../models/Survey";
import { GetVariable, SetVariable, StorageVariable } from "../../../utils/localStorage";
import LoadingScreen from "../../../components/loadingScreen";
import SurveyTitle from "../../../components/surveyTitle";
import { Button } from "react-bootstrap";

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
                            Usar estos datos ayudará a mejorar la precisión de los resultados de la
                            encuesta en el futuro.
                        </p>

                        <Button className="yesno-btn me-4" onClick={OnClickYes} variant="success">Sí</Button>
                        <Button className="yesno-btn" onClick={OnClickNo} variant="danger">No</Button>
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