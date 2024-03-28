import { FindManyNearbyParams, OrdersRepository } from "@/domain/delivery/application/repositories/orders-repository";
import { Order } from "@/domain/delivery/enterprise/entities/order";
import { getDistanceBetweenCoordinates } from "test/get-distance-between-coordinates";


export class InMemoryOrdersRepository implements OrdersRepository {
    public items: Order[] = []

    async findById(id: string): Promise<Order> {
        const order = this.items.find((item) => item.id.toString() === id)

        if (!order) {
            return null
        }

        return order
    }

    async findManyNearby(params: FindManyNearbyParams): Promise<Order[]> {
        return this.items.filter((item) => {
            const distance = getDistanceBetweenCoordinates(
                { latitude: params.latitude, longitude: params.longitude },
                { latitude: item.latitude, longitude: item.longitude })

            return distance < 10
        })
    }

    async create(order: Order): Promise<void> {
        this.items.push(order)
    }
    async save(order: Order): Promise<void> {
        const itemIndex = this.items.findIndex((item) => item.id === order.id)

        this.items[itemIndex] = order
    }

    async delete(order: Order): Promise<void> {
        const itemIndex = this.items.findIndex((item) => item.id === order.id)

        this.items.splice(itemIndex, 1)
    }

}