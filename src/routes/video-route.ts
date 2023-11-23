import {Request, Response, Router} from "express";
import {ErrorType, Params, RequestWithBody, RequestWithBodyAndParams, RequestWithParams} from "../types/common";
import {AvailableResolutions, VideoType} from "../types/video/output";
import {CreateVideoTo, UpdateVideoTo} from "../types/video/input";
import {db} from "../db/db";

export const videoRoute = Router({})

videoRoute.get('', () => {

})

videoRoute.delete('/testing/all-data', (req: Request, res: Response) => {
    db.videos = []
    res.sendStatus(204)
})

videoRoute.get('/videos', (req: Request, res: Response) => {
    res.send(db.videos)
})

videoRoute.get('/videos/:id', (req: RequestWithParams<Params>, res: Response) => {
    const id = +req.params.id

    const video = db.videos.find((v: VideoType) => v.id === id)

    if(!video) {
        return res.sendStatus(404)
    }
    return res.send(video)
})

videoRoute.post('/videos', (req: RequestWithBody<CreateVideoTo>, res: Response) => {
    let error: ErrorType = {
        errorsMessages: []
    }
    let {title, author, availableResolutions} = req.body

    if (!title || title.trim().length < 1 || title.trim().length > 40) {
        error.errorsMessages.push({message: "Invalid title", field: "title"})
    }
    if (!author || author.trim().length < 1 || author.trim().length > 20) {
        error.errorsMessages.push({message: "Invalid author", field: "author"})
    }
    if (Array.isArray(availableResolutions)) {
        availableResolutions.map((r) => {
            !AvailableResolutions.includes(r) && error.errorsMessages.push({
                message: "Invalid availableResolutions",
                field: "availableResolutions"
            })
        })
    } else {
        availableResolutions = []
    }
    if (error.errorsMessages.length) {
        res.status(400).send(error)
        return
    }
    const createAt = new Date()
    const publicationDate = new Date
    publicationDate.setDate(createAt.getDate() + 1)

    const newVideo = {
        id: +(new Date()),
        title,
        author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        availableResolutions
    }
    db.videos.push(newVideo)
    res.status(201).send(newVideo)
})

videoRoute.put('/videos/:id', (req: RequestWithBodyAndParams<Params, UpdateVideoTo>, res: Response) => {
    const id = +req.params.id
    let error: ErrorType = {
        errorsMessages: []
    }

    let {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = req.body

    if(!title || title.trim().length < 1 || title.trim().length > 40) {
        error.errorsMessages.push({message: "Invalid title", field: "title"})
    }

    if(!author || author.trim().length < 1 || author.trim().length > 20) {
        error.errorsMessages.push({message: "Invalid author", field: "author"})
    }

    if (Array.isArray(availableResolutions)) {
        availableResolutions.map((r) => {
            !AvailableResolutions.includes(r) && error.errorsMessages.push({
                message: "Invalid availableResolutions",
                field: "availableResolutions"
            })
        })
    } else {
        availableResolutions = []
    }

    if (typeof canBeDownloaded === "undefined") {
        canBeDownloaded = false
    }
    if (typeof canBeDownloaded !== "undefined" && typeof canBeDownloaded !== 'boolean') {
        error.errorsMessages.push({
            message: "Invalid canBeDownloaded",
            field: "canBeDownloaded"})
    }
    if (typeof minAgeRestriction !== "undefined" && typeof minAgeRestriction === "number") {
        minAgeRestriction < 1 || minAgeRestriction > 18 && error.errorsMessages.push({
            message: "Invalid minAgeRestriction",
            field: "minAgeRestriction"})
    } else {
        minAgeRestriction = null
    }

    const isoDateReqEx = /^[0-9]{4}-((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(02)-(0[1-9]|[12][0-9]))T(0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9]):(0[0-9]|[1-5][0-9])\.[0-9]{3}Z$/
    if (typeof publicationDate !== "undefined" &&  !isoDateReqEx.test(publicationDate)) {
        error.errorsMessages.push({
            message: "Invalid publicationDate",
            field: "publicationDate"})
    }

    if (error.errorsMessages.length) {
        res.status(400).send(error)
        return
    }
    const videoIndex = db.videos.findIndex(v => v.id === id)
    const video = db.videos.find(v => v.id === id)

    if (!video) {
        res.sendStatus(404)
        return;
    }
    const updateItem = {
        ...video,
        canBeDownloaded,
        minAgeRestriction,
        title,
        author,
        availableResolutions,
        publicationDate: publicationDate ? publicationDate : video.publicationDate
    }
    db.videos.splice(videoIndex, 1, updateItem)

    res.sendStatus(204)
})

videoRoute.delete('/videos/:id', (req: Request, res: Response) => {
    for (let i = 0; i < db.videos.length; i++) {
        if (db.videos[i].id === +req.params.id) {
            db.videos.splice(i, 1)
            res.sendStatus(204)
            return
        }
    }
    return res.sendStatus(404)

})

// app.delete('/videos/:id', (req: Request, res: Response) => {
//     const id = +req.params.id
//     const newVideos = videos.filter(v => v.id !== id)
//     if (newVideos.length < videos.length) {
//         videos = newVideos
//         res.send(204)
//     } else {
//         res.send(404)
//     }
// })