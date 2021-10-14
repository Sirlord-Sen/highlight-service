import { 
    Column,
    PrimaryGeneratedColumn, 
    Entity, 
    BaseEntity, 
    ManyToOne,
    CreateDateColumn
} from 'typeorm'
import { Topic, User } from './'

@Entity('highlights')
export class Highlight extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    highlight: string;

    @Column({default: 0})
    recalled?: number;

    @Column({default: true})
    public: boolean 

    @CreateDateColumn()
    created_at?: Date;

    @CreateDateColumn()
    updated_at?: Date;
    
    @ManyToOne(type => Topic, topic => topic.highlights) topic: Topic; 
    // @ManyToOne(type => User, user => user.highlights) user: User; 
}