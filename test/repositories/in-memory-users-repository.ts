import { UsersRepository } from "@/domain/delivery/application/repositories/users-repository";
import { User } from "@/domain/delivery/enterprise/entities/user";


export class InMemoryUsersRepository implements UsersRepository {
    public items: User[] = []

    async findByCpf(cpf: string): Promise<User> {
        const user = this.items.find((item) => item.cpf.toString() === cpf)

        if (!user) {
            return null
        }

        return user
    }
    async findById(id: string): Promise<User> {
        const user = this.items.find((item) => item.id.toString() === id)

        if (!user) {
            return null
        }

        return user
    }

    async create(user: User): Promise<void> {
        this.items.push(user)
    }
    async save(user: User): Promise<void> {
        const itemIndex = this.items.findIndex((item) => item.id === user.id)

        this.items[itemIndex] = user
    }

    async delete(user: User): Promise<void> {
        const itemIndex = this.items.findIndex((item) => item.id === user.id)

        this.items.splice(itemIndex, 1)
    }

}