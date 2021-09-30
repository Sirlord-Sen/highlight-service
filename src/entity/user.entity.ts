import { Topic, Highlight } from './'
import { 
    PrimaryColumn, 
    Entity, 
    BaseEntity, 
    OneToMany 
} 
from 'typeorm'

@Entity('users')
export class User extends BaseEntity{
    @PrimaryColumn('uuid')
    id: string;

    @OneToMany(type => Topic, topic => topic.user) topics: Topic[]
    // @OneToMany(type => Highlight, highlight => highlight.user) highlights: Highlight[]
}