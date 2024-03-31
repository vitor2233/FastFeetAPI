import { makeOrder } from 'test/factories/make-order';
import { UpdateOrderUseCase } from './update-order'; // Import the UpdateOrderUseCase
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { UserRole } from '@/domain/delivery/enterprise/entities/user';
import { makeUser } from 'test/factories/make-user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: UpdateOrderUseCase;

describe('Update Order', () => {
    beforeEach(() => {
        inMemoryOrdersRepository = new InMemoryOrdersRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        sut = new UpdateOrderUseCase(inMemoryOrdersRepository, inMemoryUsersRepository);
    });

    it('should be able to update an order', async () => {
        const order = makeOrder({}, new UniqueEntityID('order-1'))
        inMemoryOrdersRepository.items.push(order)

        const loggedUser = makeUser({ role: UserRole.ADMIN }, new UniqueEntityID('user-1'))
        await inMemoryUsersRepository.create(loggedUser)

        const result = await sut.execute({
            userId: 'user-1',
            orderId: 'order-1',
            name: 'Pacote 2',
            deliverymanId: '123',
            address: 'Rua 1',
            latitude: 123.456,
            longitude: 456.789
        });

        expect(result.isRight()).toBe(true);
        expect(result.value).toEqual({
            order: inMemoryOrdersRepository.items[0]
        });
        expect(inMemoryOrdersRepository.items[0].name).toEqual('Pacote 2');
    });
});