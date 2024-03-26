import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { DeleteOrderUseCase } from './delete-order';
import { makeOrder } from 'test/factories/make-order';
import { OrderStatus } from '@/domain/delivery/enterprise/entities/order';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let sut: DeleteOrderUseCase;

describe('Delete Order', () => {
    beforeEach(() => {
        inMemoryOrdersRepository = new InMemoryOrdersRepository();
        sut = new DeleteOrderUseCase(inMemoryOrdersRepository);
    });

    it('should be able to delete an order', async () => {
        const order = makeOrder({
            status: OrderStatus.DELIVERED
        })
        await inMemoryOrdersRepository.create(order)

        await sut.execute({
            orderId: order.id.toString()
        })

        expect(inMemoryOrdersRepository.items).toHaveLength(0)
    });

    it('should not be able to delete an order that is not delivered', async () => {
        const order = makeOrder()
        await inMemoryOrdersRepository.create(order)

        const result = await sut.execute({
            orderId: order.id.toString()
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
        expect(inMemoryOrdersRepository.items).toHaveLength(1)
    });
});