import { QuestionDetails } from "./QuestionDetails";

export enum QuestionType {
    SINGLE_CHOICE = 1,
    MULTIPLE_CHOICE = 2,
    FREE_TEXT = 3,
    DATE = 4,
    RANGE = 5
}

export function GetQuestionTypeName(type: QuestionType) {
    switch(type) {
        case QuestionType.SINGLE_CHOICE:
            return "elección única";
        
        case QuestionType.MULTIPLE_CHOICE:
            return "elección múltiple";

        case QuestionType.FREE_TEXT:
            return "texto libre";

        case QuestionType.DATE:
            return "fecha";

        case QuestionType.RANGE:
            return "escala numérica";
    }
}

export interface Question {
    ID?: string,
    InternalTitle: string,
    QuestionType: QuestionType,
    DefaultDetails: QuestionDetails,
    HasVersions: boolean,
    Help: string
}