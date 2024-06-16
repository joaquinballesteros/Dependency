export enum StorageVariable {
    SURVEY_INFO = "SurveyInfo",
    QUESTION_ORDER = "QuestionOrder",
    SELECTED_PROFILE = "SelectedProfile",
    SURVEY_QUESTIONS = "SurveyQuestions",
    CURRENT_NODE = "CurrentSurveyNode",
    TRAVERSED_NODES = "TraversedNodes"
}

export function GetVariable<T>(variable: StorageVariable): T | null {
    const fromLocalStorage = window.localStorage.getItem(variable);
    if(!fromLocalStorage) {
        return null;
    }

    return JSON.parse(fromLocalStorage);
}

export function SetVariable<T>(variable: StorageVariable, value: T) {
    window.localStorage.setItem(variable, JSON.stringify(value));
}