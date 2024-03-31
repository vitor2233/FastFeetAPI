import { InMemoryReceiversRepository } from 'test/repositories/in-memory-receivers-repository';
import { DeleteReceiverUseCase } from './delete-receiver';
import { makeReceiver } from 'test/factories/make-receiver';
import { makeUser } from 'test/factories/make-user';
import { UserRole } from '@/domain/delivery/enterprise/entities/user';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';

let inMemoryReceiversRepository: InMemoryReceiversRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: DeleteReceiverUseCase;

describe('Delete Receiver', () => {
    beforeEach(() => {
        inMemoryReceiversRepository = new InMemoryReceiversRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        sut = new DeleteReceiverUseCase(inMemoryReceiversRepository, inMemoryUsersRepository);
    });

    it('should be able to delete an receiver', async () => {
        const receiver = makeReceiver()
        await inMemoryReceiversRepository.create(receiver)

        const loggedUser = makeUser({ role: UserRole.ADMIN }, new UniqueEntityID('user-1'))
        await inMemoryUsersRepository.create(loggedUser)

        await sut.execute({
            userId: 'user-1',
            receiverId: receiver.id.toString()
        })

        expect(inMemoryReceiversRepository.items).toHaveLength(0)
    });

})