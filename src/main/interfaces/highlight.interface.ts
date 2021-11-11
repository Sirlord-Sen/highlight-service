export interface highlightTextInterface{
    highlights: string[]
}

export interface createHighlightInterface {
    user_id: string;
    userid: string
    topic_id: string;
    highlights: Array<string>;
}

export interface findUserInterface {
    user_id: string;
}
export interface findTopicInterface {
    topic_id: string;
    user_id: string;
}

export interface highlightPopInterface{
    user_id: string;
    sortBy: string;
    orderBy: 'ASC' | 'DESC' | undefined;
}

export interface updateInterface{
    highlight_id: string;
    highlight: string;
    topic_id: string;
    user_id: string
}