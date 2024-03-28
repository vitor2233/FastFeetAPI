import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { FetchNearbyOrdersUseCase } from './fetch-nearby-orders'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { makeOrder } from 'test/factories/make-order';
import { makeUser } from 'test/factories/make-user';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: FetchNearbyOrdersUseCase

describe('Fetch Nearby Orders Use Case', () => {
    beforeEach(async () => {
        inMemoryOrdersRepository = new InMemoryOrdersRepository()
        inMemoryUsersRepository = new InMemoryUsersRepository()
        sut = new FetchNearbyOrdersUseCase(inMemoryOrdersRepository, inMemoryUsersRepository)
    })

    it('should be able to fetch nearby orders', async () => {
        const user = makeUser({}, new UniqueEntityID('user-1'))
        inMemoryUsersRepository.items.push(user)

        const order1 = makeOrder({
            name: 'Near Order',
            latitude: -20.21439,
            longitude: -43.96847
        })
        const order2 = makeOrder({
            name: 'Far Order',
            latitude: -19.8621665,
            longitude: -44.6019105
        })
        inMemoryOrdersRepository.items.push(order1)
        inMemoryOrdersRepository.items.push(order2)

        const result = await sut.execute({
            deliverymanId: 'user-1',
            latitude: -20.21439,
            longitude: -43.96847
        })

        expect(result.value).toMatchObject({
            orders: [
                expect.objectContaining({ name: 'Near Order' }),
            ]
        })
    })
})