import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { DeleteUserUseCase } from './delete-user';
import { makeUser } from 'test/factories/make-user';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: DeleteUserUseCase;

describe('Delete User', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        sut = new DeleteUserUseCase(inMemoryUsersRepository);
    });

    it('should be able to delete an user', async () => {
        const user = makeUser()
        await inMemoryUsersRepository.create(user)

        await sut.execute({
            userId: user.id.toString()
        })

        expect(inMemoryUsersRepository.items).toHaveLength(0)
    });

})