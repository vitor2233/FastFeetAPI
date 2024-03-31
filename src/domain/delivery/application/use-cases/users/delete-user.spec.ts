import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { DeleteUserUseCase } from './delete-user';
import { makeUser } from 'test/factories/make-user';
import { UserRole } from '@/domain/delivery/enterprise/entities/user';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: DeleteUserUseCase;

describe('Delete User', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        sut = new DeleteUserUseCase(inMemoryUsersRepository);
    });

    it('should be able to delete an user', async () => {
        const user = makeUser({ role: UserRole.ADMIN }, new UniqueEntityID('user-1'))
        await inMemoryUsersRepository.create(user)

        await sut.execute({
            loggedUserId: 'user-1',
            userId: user.id.toString()
        })

        expect(inMemoryUsersRepository.items).toHaveLength(0)
    });

})