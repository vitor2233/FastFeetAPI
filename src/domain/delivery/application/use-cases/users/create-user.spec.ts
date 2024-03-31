import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { CreateUserUseCase } from './create-user'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeUser } from 'test/factories/make-user'
import { UserRole } from '@/domain/delivery/enterprise/entities/user'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let sut: CreateUserUseCase

describe('Create User', () => {
    beforeEach(() => {
        inMemoryUsersRepository =
            new InMemoryUsersRepository()
        fakeHasher = new FakeHasher()
        sut = new CreateUserUseCase(inMemoryUsersRepository, fakeHasher)
    })

    it('should be able to create a user', async () => {
        const loggedUser = makeUser({ role: UserRole.ADMIN }, new UniqueEntityID('user-1'))
        await inMemoryUsersRepository.create(loggedUser)

        const result = await sut.execute({
            userId: 'user-1',
            name: 'Vitor',
            cpf: '111.111.111-11',
            password: '12345',
            role: 'DELIVERYMAN'
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            user: inMemoryUsersRepository.items[1]
        })
    })

    it('should hash student password upon registration', async () => {
        const loggedUser = makeUser({ role: UserRole.ADMIN }, new UniqueEntityID('user-1'))
        await inMemoryUsersRepository.create(loggedUser)

        const result = await sut.execute({
            userId: 'user-1',
            name: 'Vitor',
            cpf: '111.111.111-11',
            password: '12345',
            role: 'DELIVERYMAN'
        })

        const hashedPassword = await fakeHasher.hash('12345')

        expect(result.isRight()).toBe(true)
        expect(inMemoryUsersRepository.items[1].password).toEqual(hashedPassword)
    })

})