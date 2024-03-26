import { ReceiversRepository } from "@/domain/delivery/application/repositories/receivers-repository";
import { Receiver } from "@/domain/delivery/enterprise/entities/receiver";


export class InMemoryReceiversRepository implements ReceiversRepository {
    public items: Receiver[] = []

    async findById(id: string): Promise<Receiver> {
        const receiver = this.items.find((item) => item.id.toString() === id)

        if (!receiver) {
            return null
        }

        return receiver
    }

    async create(receiver: Receiver): Promise<void> {
        this.items.push(receiver)
    }
    async save(receiver: Receiver): Promise<void> {
        const itemIndex = this.items.findIndex((item) => item.id === receiver.id)

        this.items[itemIndex] = receiver
    }

    async delete(receiver: Receiver): Promise<void> {
        const itemIndex = this.items.findIndex((item) => item.id === receiver.id)

        this.items.splice(itemIndex, 1)
    }

}