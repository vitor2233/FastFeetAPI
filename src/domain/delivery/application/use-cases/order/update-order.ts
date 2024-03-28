import { Either, left, right } from "@/core/either";
import { OrdersRepository } from "../../repositories/orders-repository";
import { Order } from "@/domain/delivery/enterprise/entities/order";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface UpdateOrderUseCaseRequest {
    orderId: string
    deliverymanId: string
    name: string
    address: string
    latitude: number
    longitude: number
}

type UpdateOrderUseCaseResponse = Either<ResourceNotFoundError, { order: Order }>

export class UpdateOrderUseCase {
    constructor(
        private ordersRepository: OrdersRepository,
    ) { }

    async execute({ orderId, name, address, latitude, longitude, deliverymanId }: UpdateOrderUseCaseRequest): Promise<UpdateOrderUseCaseResponse> {
        const order = await this.ordersRepository.findById(orderId)
        if (!order) {
            return left(new ResourceNotFoundError())
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