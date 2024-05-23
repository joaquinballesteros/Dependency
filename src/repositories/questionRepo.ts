import { Question } from "../models/Question";
import { Delete, Get, Post, Put } from "./dbContext";

export async function GetAllQuestions(surveyId: string): Promise<Question[]|undefined> {
    return await Get(`survey/${surveyId}/question`);
}

export async function GetQuestion(surveyId: string, questionId: string): Promise<Question|undefined> {
    return await Get(`survey/${surveyId}/question/${questionId}`);
}

export async function AddQuestion(surveyId: string, question: Question): Promise<Question> {
    return await Post(`survey/${surveyId}/question`, question);
}

export async function UpdateQuestion(surveyId: string, questionId: string, question: Question) {
    return await Put(`survey/${surveyId}/question/${questionId}`, question);
}

export async function DeleteQuestion(surveyId: string, questionId: string) {
    return await Delete(`survey/${surveyId}/question/${questionId}`);
}