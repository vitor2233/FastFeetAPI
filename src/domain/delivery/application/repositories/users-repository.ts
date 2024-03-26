import { User } from "../../enterprise/entities/user";

export abstract class UsersRepository {
    abstract findByCpf(cpf: string): Promise<User | null>
    abstract findById(id: string): Promise<User | null>
    abstract create(user: User): Promise<void>
    abstract save(user: User): Promise<void>
    abstract delete(user: User): Promise<void>
}