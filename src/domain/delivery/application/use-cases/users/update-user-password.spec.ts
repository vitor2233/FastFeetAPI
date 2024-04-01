import { makeUser } from 'test/factories/make-user';
import { UpdateUserUseCase } from './update-user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { UpdateUserPasswordUseCase } from './update-user-password';
import { WrongCredentialsError } from '../errors/wrong-credentials-error';
import { UserRole } from '@/domain/delivery/enterprise/entities/user';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let sut: UpdateUserPasswordUseCase;

describe('Update User Password', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        fakeHasher = new FakeHasher();
        sut = new UpdateUserPasswordUseCase(inMemoryUsersRepository, fakeHasher, fakeHasher);
    });

    it('should be able to update an users password', async () => {
        const user = makeUser({
            role: UserRole.ADMIN,
            password: await fakeHasher.hash('old')
        }, new UniqueEntityID('user-1'))
        inMemoryUsersRepository.items.push(user)

        const result = await sut.execute({
            loggedUserId: 'user-1',
            userId: 'user-1',
            oldPassword: 'old',
            newPassword: 'new'
        });

        expect(result.isRight()).toBe(true);
        expect(result.value).toEqual({
            user: inMemoryUsersRepository.items[0]
        });
        expect(inMemoryUsersRepository.items[0].password).toBe('new-hashed')
    });

    it('should not be able to update an users password with wrong old password', async () => {
        const user = makeUser({
            role: UserRole.ADMIN,
            password: await fakeHasher.hash('old')
        }, new UniqueEntityID('user-1'))
        inMemoryUsersRepository.items.push(user)

        const result = await sut.execute({
            loggedUserId: 'user-1',
            userId: 'user-1',
            oldPassword: 'old2',
            newPassword: 'new'
        });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(WrongCredentialsError)
    });
});