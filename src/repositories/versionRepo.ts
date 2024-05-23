import { QuestionVersion } from "../models/QuestionVersion";
import { Delete, Get, Post, Put } from "./dbContext";

export async function GetAllVersions(surveyId: string, questionId: string): Promise<QuestionVersion[]|undefined> {
    return await Get(`survey/${surveyId}/question/${questionId}/version`);
}

export async function GetVersion(surveyId: string, questionId: string, versionId: string): Promise<QuestionVersion|undefined> {
    return await Get(`survey/${surveyId}/question/${questionId}/version/${versionId}`);
}

export async function AddVersion(surveyId: string, questionId: string, version: QuestionVersion): Promise<QuestionVersion|undefined> {
    return await Post(`survey/${surveyId}/question/${questionId}/version`, version);
}

export async function UpdateVersion(surveyId: string, questionId: string, versionId: string, version: QuestionVersion){
    return await Put(`survey/${surveyId}/question/${questionId}/version/${versionId}`, version);
}

export async function DeleteVersion(surveyId: string, questionId: string, versionId: string) {
    return await Delete(`survey/${surveyId}/question/${questionId}/version/${versionId}`);
}