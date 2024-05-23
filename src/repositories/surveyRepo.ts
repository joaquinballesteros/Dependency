import { Survey } from "../models/Survey";
import { Delete, Get, Post, Put } from "./dbContext";

const SurveyBackendPath = "survey";

export async function GetAllSurveys(): Promise<Survey[]> {
    return await Get(SurveyBackendPath);
}

export async function GetSurvey(id: string): Promise<Survey|undefined> {
    return await Get(`${SurveyBackendPath}/${id}`);
}

export async function UpdateSurvey(id: string, survey: Survey) {
    return await Put(`${SurveyBackendPath}/${id}`, survey);
}

export async function AddSurvey(survey: Survey) {
    return await Post(SurveyBackendPath, survey);
}

export async function DeleteSurvey(id: string) {
    return await Delete(`${SurveyBackendPath}/${id}`);
}