import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { DeleteOrderUseCase } from './delete-order';
import { makeOrder } from 'test/factories/make-order';
import { OrderStatus } from '@/domain/delivery/enterprise/entities/order';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { makeUser } from 'test/factories/make-user';
import { UserRole } from '@/domain/delivery/enterprise/entities/user';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: DeleteOrderUseCase;

describe('Delete Order', () => {
    beforeEach(() => {
        inMemoryOrdersRepository = new InMemoryOrdersRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        sut = new DeleteOrderUseCase(inMemoryOrdersRepository, inMemoryUsersRepository);
    });

    it('should be able to delete an order', async () => {
        const order = makeOrder({
            status: OrderStatus.DELIVERED
        })
        await inMemoryOrdersRepository.create(order)

        const loggedUser = makeUser({ role: UserRole.ADMIN }, new UniqueEntityID('user-1'))
        await inMemoryUsersRepository.create(loggedUser)

        await sut.execute({
            userId: 'user-1',
            orderId: order.id.toString()
        })

        expect(inMemoryOrdersRepository.items).toHaveLength(0)
    });

    it('should not be able to delete an order that is not delivered', async () => {
        const order = makeOrder()
        await inMemoryOrdersRepository.create(order)

        const loggedUser = makeUser({ role: UserRole.ADMIN }, new UniqueEntityID('user-1'))
        await inMemoryUsersRepository.create(loggedUser)

        const result = await sut.execute({
            userId: 'user-1',
            orderId: order.id.toString()
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
        expect(inMemoryOrdersRepository.items).toHaveLength(1)
    });
});