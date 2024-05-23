import { useParams } from "react-router-dom";
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { Button, Form, FormCheck, Spinner } from "react-bootstrap";
import { Survey } from "../../../models/Survey";
import { GetVariable, SetVariable, StorageVariable } from "../../../utils/localStorage";
import { Profile } from "../../../models/Profile";
import { GetAllProfiles } from "../../../repositories/profilesRepo";
import { GetQuestion } from "../../../repositories/questionRepo";
import { GetAllVersions } from "../../../repositories/versionRepo";
import { QuestionDetails } from "../../../models/QuestionDetails";
import { SurveyQuestion } from "../../../models/SurveyQuestion";
import SurveyTitle from "../../../components/surveyTitle";

function SelectProfile() {
    const params = useParams();
    const surveyId = params.surveyId!;

    const [survey, setSurvey] = useState<Survey|undefined>();
    const [questionOrder, setQuestionOrder] = useState<string[]|undefined>();
    const [profiles, setProfiles] = useState<Profile[]|undefined>();
    const [selectedProfile, setSelectedProfile] = useState("NoProfile");

    const FetchProfiles = useCallback(async function () {
        const fetchedProfiles = await GetAllProfiles(surveyId);
        if(fetchedProfiles) {
            setProfiles(fetchedProfiles);
        }
    }, [surveyId])

    useEffect(() => {
        const existingSurvey = GetVariable<Survey>(StorageVariable.SURVEY_INFO);
        const existingQuestionOrder = GetVariable<string[]>(StorageVariable.QUESTION_ORDER);

        if(existingSurvey && existingSurvey.ID === surveyId && existingQuestionOrder) {
            setSurvey(existingSurvey);
            setQuestionOrder(existingQuestionOrder);
            FetchProfiles()
        } else {
            window.location.href = `/${surveyId}/start`
        }
    }, [surveyId, FetchProfiles]);

    function OnChangeSelectedProfile(e: ChangeEvent<HTMLInputElement>) {
        setSelectedProfile(e.target.value);
    }

    async function OnSubmit(e: FormEvent) {
        e.preventDefault();
        
        SetVariable(StorageVariable.SELECTED_PROFILE, selectedProfile);

        if(!questionOrder) {
            return;
        }

        const surveyQuestions: SurveyQuestion[] = [];

        for (let i = 0; i < questionOrder.length; i++) {
            const questionId = questionOrder[i];
            
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

                surveyQuestions.push({
                    ID: question.ID!,
                    QuestionType: question.QuestionType,
                    Details: questionDetails!
                })
            }
        }

        SetVariable(StorageVariable.SURVEY_QUESTIONS, surveyQuestions);
        window.location.href = `/${surveyId}/answer`;
    }

    return <>
        {
            profiles && survey?
            <>
            <SurveyTitle title={survey.Title}></SurveyTitle>
            <main>
                <h2 className="survey-description">Seleccione que perfil más se le ajusta:</h2>

                <Form onSubmit={OnSubmit}>
                    <FormCheck name="selected-profile" onChange={OnChangeSelectedProfile}>
                        <Form.Check type="radio" name="selected-profile" value="NoProfile" label="Ninguno" defaultChecked={true}></Form.Check>

                        {
                            profiles.map(profile => {
                                return <>
                                    <Form.Check key={profile.ID} type="radio" name="selected-profile" value={profile.ID} label={profile.Title}></Form.Check>
                                </>
                            })
                        }
                    </FormCheck>

                    <Button type="submit" variant="secondary">Continuar</Button>
                </Form>
            </main>
            </>
            :
            survey?
            <>
                <SurveyTitle title={survey.Title}></SurveyTitle>
                <main>
                    <Spinner></Spinner>
                </main>
            </>
            :
            <main>
                <Spinner></Spinner>
            </main>
        }
    </>;
}

export default SelectProfile;