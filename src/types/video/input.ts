import {AvailableResolutions} from "./output";


export type CreateVideoTo = {
    title: string,
    author:string,
    availableResolutions: typeof AvailableResolutions
}

export type UpdateVideoTo = {
    title: string,
    author: string,
    availableResolutions: typeof AvailableResolutions
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    publicationDate: string
}