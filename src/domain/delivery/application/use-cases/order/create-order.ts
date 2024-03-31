import { Either, left, right } from "@/core/either";
import { OrdersRepository } from "../../repositories/orders-repository";
import { Order, OrderStatus } from "@/domain/delivery/enterprise/entities/order";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../../repositories/users-repository";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { UserRole } from "@/domain/delivery/enterprise/entities/user";

interface CreateOrderUseCaseRequest {
    receiverId: string
    userId: string
    name: string
    address: string
    latitude: number
    longitude: number
}

type CreateOrderUseCaseResponse = Either<NotAllowedError, { order: Order }>

@Injectable()
export class CreateOrderUseCase {
    constructor(
        private ordersRepository: OrdersRepository,
        private usersRepository: UsersRepository,
    ) { }

    async execute({ receiverId, userId, name, address, latitude, longitude }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
        const user = await this.usersRepository.findById(userId)
        if (user.role != UserRole.ADMIN) {
            return left(new NotAllowedError())
        }

        const order = Order.create({
            name,
            address,
            latitude,
            longitude,
            receiverId: new UniqueEntityID(receiverId),
            status: OrderStatus.WAITING,
        })

        await this.ordersRepository.create(order)

        return right({
            order
        })
    }

}