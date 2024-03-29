import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { FetchDeliverymanOrdersUseCase } from './fetch-deliveryman-orders'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { makeOrder } from 'test/factories/make-order';
import { makeUser } from 'test/factories/make-user';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: FetchDeliverymanOrdersUseCase

describe('Fetch Deliveryman Orders Use Case', () => {
    beforeEach(async () => {
        inMemoryOrdersRepository = new InMemoryOrdersRepository()
        inMemoryUsersRepository = new InMemoryUsersRepository()
        sut = new FetchDeliverymanOrdersUseCase(inMemoryOrdersRepository, inMemoryUsersRepository)
    })

    it('should be able to fetch deliveryman orders', async () => {
        const user = makeUser({}, new UniqueEntityID('user-1'))
        inMemoryUsersRepository.items.push(user)

        const order1 = makeOrder({
            deliverymanId: user.id
        })
        const order2 = makeOrder({
            deliverymanId: user.id
        })
        inMemoryOrdersRepository.items.push(order1)
        inMemoryOrdersRepository.items.push(order2)

        const result = await sut.execute({
            deliverymanId: 'user-1',
        })

        expect(result.isRight())
        expect(result.value).toMatchObject({
            orders: [
                expect.objectContaining({ deliverymanId: new UniqueEntityID('user-1') }),
                expect.objectContaining({ deliverymanId: new UniqueEntityID('user-1') }),
            ]
        })
    })
})