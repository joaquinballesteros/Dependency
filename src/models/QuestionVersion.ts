import { QuestionDetails } from "./QuestionDetails";

export interface QuestionVersion {
    ID?: string,
    Title: string,
    Description: string,
    Profiles: string[],
    Details: QuestionDetails
}