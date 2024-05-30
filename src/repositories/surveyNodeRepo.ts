import { SurveyNode } from "../models/SurveyNode";
import { Get } from "./dbContext";

export async function GetRootNode(surveyId: string): Promise<SurveyNode | undefined> {
    return await Get(`survey/${surveyId}/decisionTree/start`);
}

export async function GetNextNode(surveyId: string, nodeId: string, answer: number): Promise<SurveyNode | undefined> {
    return await Get(`survey/${surveyId}/decisionTree/${nodeId}/next?answer=${answer}`);
}