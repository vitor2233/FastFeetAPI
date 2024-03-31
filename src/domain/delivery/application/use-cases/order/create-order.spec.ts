import { UserRole } from '@/domain/delivery/enterprise/entities/user'
import { CreateOrderUseCase } from './create-order'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: CreateOrderUseCase;

describe('Create Order', () => {
    beforeEach(() => {
        inMemoryOrdersRepository =
            new InMemoryOrdersRepository()
        inMemoryUsersRepository = new InMemoryUsersRepository()
        sut = new CreateOrderUseCase(inMemoryOrdersRepository, inMemoryUsersRepository)
    })

    it('should be able to create an order', async () => {
        const loggedUser = makeUser({ role: UserRole.ADMIN }, new UniqueEntityID('user-1'))
        await inMemoryUsersRepository.create(loggedUser)

        const result = await sut.execute({
            userId: 'user-1',
            name: 'Pacote 01',
            address: 'Rua teste, 123',
            latitude: -19.974579,
            longitude: -43.9464643,
            receiverId: '123'
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            order: inMemoryOrdersRepository.items[0]
        })
    })

})