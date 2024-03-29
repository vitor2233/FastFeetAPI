import { Entity } from "src/core/entities/entity";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export enum UserRole {
    DELIVERYMAN,
    ADMIN
}

export interface UserProps {
    cpf: string
    name: string
    password: string
    role: UserRole
}

export class User extends Entity<UserProps>{
    get cpf() {
        return this.props.cpf
    }
    get name() {
        return this.props.name
    }
    get password() {
        return this.props.password
    }
    get role() {
        return this.props.role
    }

    set name(name: string) {
        this.props.name = name
    }
    set cpf(cpf: string) {
        this.props.cpf = cpf
    }
    set password(password: string) {
        this.props.password = password
    }

    static create(props: UserProps, id?: UniqueEntityID) {
        const user = new User(props, id)
        return user
    }
}