import { User } from '../entity/user.entity'

export function pushHighlight(userHighlights: User):Object[]{
    let highlightTopics: object[] =[];

    for(let topic of userHighlights.topics){
        let highlights: object[] = []
        let topicData = {topicId: '' , highlights}
        topicData.topicId = topic.id 
        for(let highlight of topic.highlights){
            let single_highlight = {
                id: highlight.id,
                highlight: highlight.highlight,
                public: highlight.public
            }
            topicData.highlights.push(single_highlight)
        }
        highlightTopics.push(topicData)
    }
    console.log(highlightTopics)
    return highlightTopics
}