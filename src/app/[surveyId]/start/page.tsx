import { useParams } from "react-router-dom";
import { GetSurvey } from "../../../repositories/surveyRepo";
import { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Survey } from "../../../models/Survey";
import { GetVariable, SetVariable, StorageVariable } from "../../../utils/localStorage";
import SurveyTitle from "../../../components/surveyTitle";
import LoadingScreen from "../../../components/loadingScreen";

function StartSurvey() {
    const params = useParams();
    const surveyId = params.surveyId!;

    const [survey, setSurvey] = useState<Survey | undefined>();

    const FetchSurveyData = useCallback(async function () {
        const fetchedSurvey = await GetSurvey(surveyId);
        if (fetchedSurvey) {
            SetVariable(StorageVariable.SURVEY_INFO, fetchedSurvey);

            const surveyLoadOrder = fetchedSurvey.LoadOrder;
    
            if(surveyLoadOrder) {
                const loadOrder: string[] = [...surveyLoadOrder];

                fetchedSurvey.QuestionOrder.forEach(id => {
                    if(!surveyLoadOrder.includes(id)) {
                        loadOrder.push(id);
                    }
                });

                SetVariable(StorageVariable.QUESTION_ORDER, loadOrder);
            } else {
                SetVariable(StorageVariable.QUESTION_ORDER, fetchedSurvey.QuestionOrder);
            }

            setSurvey(fetchedSurvey);
        }
    }, [surveyId])

    useEffect(() => {
        const existingSurvey = GetVariable<Survey>(StorageVariable.SURVEY_INFO);

        if (existingSurvey && existingSurvey.ID === surveyId) {
            setSurvey(existingSurvey);
        } else {
            FetchSurveyData();
        }
    }, [surveyId, FetchSurveyData]);

    function OnContinueButtonClick() {
        window.location.href = `/${surveyId}/consent`;
    }

    return <>
        {
            survey ?
                <>
                    <SurveyTitle title={survey.Title}></SurveyTitle>
                    <main>
                        <p className="survey-description">{survey.PublicDescription}</p>

                        <Button onClick={OnContinueButtonClick} variant="secondary">Comenzar Encuesta</Button>
                    </main>
                </>
                :
                <main>
                    <LoadingScreen></LoadingScreen>
                </main>
        }
    </>;
}

export default StartSurvey;