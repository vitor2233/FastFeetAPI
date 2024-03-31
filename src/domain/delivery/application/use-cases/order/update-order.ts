import { Either, left, right } from "@/core/either";
import { OrdersRepository } from "../../repositories/orders-repository";
import { Order } from "@/domain/delivery/enterprise/entities/order";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../../repositories/users-repository";
import { UserRole } from "@/domain/delivery/enterprise/entities/user";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

interface UpdateOrderUseCaseRequest {
    orderId: string
    userId: string
    deliverymanId: string
    name: string
    address: string
    latitude: number
    longitude: number
}

type UpdateOrderUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, { order: Order }>

@Injectable()
export class UpdateOrderUseCase {
    constructor(
        private ordersRepository: OrdersRepository,
        private usersRepository: UsersRepository,
    ) { }

    async execute({ orderId, userId, name, address, latitude, longitude, deliverymanId }: UpdateOrderUseCaseRequest): Promise<UpdateOrderUseCaseResponse> {
        const order = await this.ordersRepository.findById(orderId)
        if (!order) {
            return left(new ResourceNotFoundError())
        }

        const user = await this.usersRepository.findById(userId)
        if (user.role != UserRole.ADMIN) {
            return left(new NotAllowedError())
        }

        order.deliverymanId = new UniqueEntityID(deliverymanId)
        order.name = name
        order.address = address
        order.latitude = latitude
        order.longitude = longitude

        await this.ordersRepository.save(order)

        return right({
            order
        })
    }

}