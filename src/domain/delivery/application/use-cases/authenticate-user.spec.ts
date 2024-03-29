import { AuthenticateUserUseCase } from './authenticate-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeUser } from 'test/factories/make-user'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateUserUseCase

describe('Authenticate User', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        fakeHasher = new FakeHasher()
        fakeEncrypter = new FakeEncrypter()
        sut = new AuthenticateUserUseCase(inMemoryUsersRepository, fakeHasher, fakeEncrypter)
    })

    it('should be able to authenticate a user', async () => {
        const user = makeUser({
            cpf: '111.111.111-11',
            password: await fakeHasher.hash('12345')
        })
        inMemoryUsersRepository.items.push(user)

        const result = await sut.execute({
            cpf: '111.111.111-11',
            password: '12345'
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            accessToken: expect.any(String)
        })
    })
})

