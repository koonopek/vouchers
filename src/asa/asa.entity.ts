import { Optional } from "@nestjs/common";
import User from "src/user/user.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Asa {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    asaID: number;

    @Column()
    name: string;

    @Column()
    unitName: string;

    @Column({nullable: true})
    appID: number;
    
    @Column({nullable: true})
    assetUrl: string;

    @Column({default: false})
    valid: boolean;

    @ManyToMany(() => User, {eager: true})
    @JoinTable()
    whitelist: User[];
}