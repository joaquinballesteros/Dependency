import { QuestionType } from "./Question";
import { QuestionDetails } from "./QuestionDetails";

export interface SurveyQuestion {
    ID: string,
    QuestionType: QuestionType,
    Details: QuestionDetails
}