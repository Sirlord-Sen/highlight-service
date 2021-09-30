import { Request } from 'express'

export class userDto {
    id: string
    username: string
    email: string
    firstname: string
    surname: string
    resetPasswordToken: string | null
    resetPasswordExpires: string | null
}

export interface CRequest<T> extends Request{
    body: T
}

export class createCustomDto{
    highlight: string
    topic_id : string
    user_id: string
}

export class createDto{
    topic_id : string
}

export class UpdateDto{
    topic_id : string
    highlight: string
    highlight_id: string
    user_id: string
}

export class popQueryDto{
    orderBy: 'ASC' | 'DESC' | undefined
    sortBy: string
    user_id: string
}