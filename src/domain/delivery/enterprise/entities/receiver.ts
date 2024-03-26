import { Optional } from "@/core/types/optional";
import { Entity } from "src/core/entities/entity";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export enum UserRole {
    DELIVERYMAN,
    ADMIN
}

export interface ReceiverProps {
    name: string
    address: string
    latitude: number
    longitude: number
    createdAt: Date
    updatedAt?: Date | null
}

export class Receiver extends Entity<ReceiverProps>{
    get address() {
        return this.props.address
    }
    get name() {
        return this.props.name
    }
    get latitude() {
        return this.props.latitude
    }
    get longitude() {
        return this.props.longitude
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
    set address(address: string) {
        this.props.address = address
        this.touch()
    }
    set latitude(latitude: number) {
        this.props.latitude = latitude
        this.touch()
    }
    set longitude(longitude: number) {
        this.props.longitude = longitude
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