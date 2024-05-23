import { Profile } from "../models/Profile";
import { Delete, Get, Post, Put } from "./dbContext";

export async function GetAllProfiles(surveyId: string): Promise<Profile[]|undefined> {
    return await Get(`survey/${surveyId}/profile`);
}

export async function GetProfile(surveyId: string, profileId: string): Promise<Profile|undefined> {
    return await Get(`survey/${surveyId}/profile/${profileId}`);
}

export async function AddProfile(surveyId: string, profile: Profile) {
    return await Post(`survey/${surveyId}/profile`, profile);
}

export async function UpdateProfile(surveyId: string, profileId: string, profile: Profile) {
    return await Put(`survey/${surveyId}/profile/${profileId}`, profile);
}

export async function DeleteProfile(surveyId: string, profileId: string) {
    return await Delete(`survey/${surveyId}/profile/${profileId}`);
}