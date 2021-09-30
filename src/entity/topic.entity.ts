import { Highlight, User } from './'
import { 
    PrimaryColumn,
    Entity, 
    BaseEntity, 
    OneToMany, 
    ManyToOne,
    Column
} 
from 'typeorm'

@Entity('topics')
export class Topic extends BaseEntity{
    @PrimaryColumn('uuid')
    id: string;

    @Column({default: 0})
    recalled_set?: number

    @Column({default: 0})
    counter?: boolean

    @OneToMany(type => Highlight, highlight => highlight.topic) highlights: Highlight[]

    @ManyToOne(type => User, user => user.topics) user: User; 
}