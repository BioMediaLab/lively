import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  name: string
  @Column()
  email: string
}
