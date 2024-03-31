import { Optional } from "@/core/types/optional";
import { Entity } from "src/core/entities/entity";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export interface ReceiverProps {
    name: string
    createdAt: Date
    updatedAt?: Date | null
}

export class Receiver extends Entity<ReceiverProps>{
    get name() {
        return this.props.name
    }
    get createdAt() {
        return this.props.createdAt
    }
    get updatedAt() {
        return this.props.updatedAt
    }

    set name(name: string) {
        this.props.name = name
        this.touch()
    }

    private touch() {
        this.props.updatedAt = new Date()
    }

    static create(props: Optional<ReceiverProps, 'createdAt'>, id?: UniqueEntityID) {
        const receiver = new Receiver(
            {
                ...props,
                createdAt: props.createdAt ?? new Date()
            }, id)
        return receiver
    }
}