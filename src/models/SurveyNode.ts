export interface SurveyNode {
    ID: string,
    IsRoot: boolean,
    QuestionId?: string,
    NextPerAnswer: {[key: number]: string},
    Result: number
}