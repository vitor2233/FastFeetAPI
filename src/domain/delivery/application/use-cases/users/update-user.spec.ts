import { makeUser } from 'test/factories/make-user';
import { UpdateUserUseCase } from './update-user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { UserRole } from '@/domain/delivery/enterprise/entities/user';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: UpdateUserUseCase;

describe('Update User', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        sut = new UpdateUserUseCase(inMemoryUsersRepository);
    });

    it('should be able to update an user', async () => {
        const user = makeUser({ role: UserRole.ADMIN }, new UniqueEntityID('user-1'))
        inMemoryUsersRepository.items.push(user)

        const result = await sut.execute({
            loggedUserId: 'user-1',
            userId: 'user-1',
            cpf: '111.111.111-11',
            name: 'Usuário novo'
        });

        expect(result.isRight()).toBe(true);
        expect(result.value).toEqual({
            user: inMemoryUsersRepository.items[0]
        });
        expect(inMemoryUsersRepository.items[0].name).toEqual('Usuário novo');
    });
});