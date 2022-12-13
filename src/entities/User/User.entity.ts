import {
  Column,
  Entity,
  EntityRepository,
  Index,
  PrimaryGeneratedColumn,
  Repository,
} from 'typeorm';

export interface UserPost {
  username: string;
  email: string;
  bio?: string;
  image?: string;
  password: string;
}
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column()
  username!: string;

  @Index({ unique: true })
  @Column()
  email!: string;

  @Column({ default: '' })
  bio!: string;

  @Column({ default: '' })
  image!: string;

  @Column()
  password!: string;
}
@EntityRepository(User)
export class UserRepository extends Repository<User> {}
