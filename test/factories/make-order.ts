import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Order, OrderProps, OrderStatus } from "@/domain/delivery/enterprise/entities/order"
import { faker } from "@faker-js/faker"

export function makeOrder(
    override: Partial<OrderProps> = {},
    id?: UniqueEntityID,
) {
    const question = Order.create(
        {
            name: faker.person.fullName(),
            deliverymanId: null,
            address: faker.location.streetAddress(),
            latitude: faker.location.latitude(),
            longitude: faker.location.longitude(),
            status: OrderStatus.WAITING,
            receiverId: new UniqueEntityID(),
            ...override,
        },
        id,
    )

    return question
}