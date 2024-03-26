import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { CreateUserUseCase } from './create-user'
import { FakeHasher } from 'test/cryptography/fake-hasher'

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
        const result = await sut.execute({
            name: 'Vitor',
            cpf: '111.111.111-11',
            password: '12345',
            role: 'DELIVERYMAN'
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            user: inMemoryUsersRepository.items[0]
        })
    })

    it('should hash student password upon registration', async () => {
        const result = await sut.execute({
            name: 'Vitor',
            cpf: '111.111.111-11',
            password: '12345',
            role: 'DELIVERYMAN'
        })

        const hashedPassword = await fakeHasher.hash('12345')

        expect(result.isRight()).toBe(true)
        expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword)
    })

})