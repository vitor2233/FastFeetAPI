import { InMemoryReceiversRepository } from 'test/repositories/in-memory-receivers-repository'
import { CreateReceiverUseCase } from './create-receiver'
import { makeUser } from 'test/factories/make-user'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserRole } from '@/domain/delivery/enterprise/entities/user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

let inMemoryReceiversRepository: InMemoryReceiversRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: CreateReceiverUseCase;

describe('Create Receiver', () => {
    beforeEach(() => {
        inMemoryReceiversRepository =
            new InMemoryReceiversRepository()
        inMemoryUsersRepository = new InMemoryUsersRepository()
        sut = new CreateReceiverUseCase(inMemoryReceiversRepository, inMemoryUsersRepository)
    })

    it('should be able to create a receiver', async () => {
        const loggedUser = makeUser({ role: UserRole.ADMIN }, new UniqueEntityID('user-1'))
        await inMemoryUsersRepository.create(loggedUser)

        const result = await sut.execute({
            userId: 'user-1',
            name: 'Vitor',
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            receiver: inMemoryReceiversRepository.items[0]
        })
    })

})