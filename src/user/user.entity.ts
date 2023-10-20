import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {
    //CE  Comprobante de egreso
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true, unique: true})
    username: string

    @Column({nullable: true})
    password: string
    
}