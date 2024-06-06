export interface Survey {
    ID : string,
    Title : string,
    PrivateDescription : string,
    PublicDescription : string,
    QuestionOrder: string[],
    LoadOrder?: string[]
}