import { makeOrder } from 'test/factories/make-order';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeUser } from 'test/factories/make-user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { RefoundOrderUseCase } from './refound-order';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: RefoundOrderUseCase;

describe('Refound Order', () => {
    beforeEach(() => {
        inMemoryOrdersRepository = new InMemoryOrdersRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        sut = new RefoundOrderUseCase(inMemoryOrdersRepository, inMemoryUsersRepository);
    });

    it('should be able to refound an order', async () => {
        const order = makeOrder({}, new UniqueEntityID('order-1'))
        const user = makeUser({}, new UniqueEntityID('user-1'))
        inMemoryOrdersRepository.items.push(order)
        inMemoryUsersRepository.items.push(user)

        const result = await sut.execute({
            orderId: 'order-1',
            deliverymanId: 'user-1'
        });

        expect(result.isRight()).toBe(true);
        expect(inMemoryOrdersRepository.items[0].deliverymanId.toString()).toEqual('user-1');
        expect(inMemoryOrdersRepository.items[0].withdrawnDate).toBeNull()
    });
});