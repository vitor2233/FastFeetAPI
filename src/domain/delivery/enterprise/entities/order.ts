import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"

export enum OrderStatus {
    WAITING,
    WITHDRAWN,
    DELIVERED
}

export interface OrderProps {
    receiverId: UniqueEntityID
    deliverymanId?: UniqueEntityID | null
    status: OrderStatus
    name: string
    withdrawnDate?: Date
    deliveryDate?: Date
    createdAt: Date
    updatedAt?: Date | null
}

export class Order extends Entity<OrderProps>{
    get receiverId() {
        return this.props.receiverId
    }
    get deliverymanId() {
        return this.props.deliverymanId
    }
    get status() {
        return this.props.status
    }
    get name() {
        return this.props.name
    }
    get withdrawnDate() {
        return this.props.withdrawnDate
    }
    get deliveryDate() {
        return this.props.deliveryDate
    }
    get createdAt() {
        return this.props.createdAt
    }
    get updatedAt() {
        return this.props.updatedAt
    }

    set deliverymanId(deliverymanId: UniqueEntityID) {
        this.props.deliverymanId = deliverymanId
        this.touch()
    }
    set status(status: OrderStatus) {
        this.props.status = status
        this.touch()
    }
    set name(name: string) {
        this.props.name = name
        this.touch()
    }
    set withdrawnDate(withdrawnDate: Date) {
        this.props.withdrawnDate = withdrawnDate
        this.touch()
    }
    set deliveryDate(deliveryDate: Date) {
        this.props.deliveryDate = deliveryDate
        this.touch()
    }

    private touch() {
        this.props.updatedAt = new Date()
    }

    static create(props: Optional<OrderProps, 'createdAt'>, id?: UniqueEntityID) {
        const order = new Order(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
            }, id)
        return order
    }
}