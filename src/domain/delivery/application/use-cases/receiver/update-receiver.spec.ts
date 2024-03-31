import { makeReceiver } from 'test/factories/make-receiver';
import { UpdateReceiverUseCase } from './update-receiver';
import { InMemoryReceiversRepository } from 'test/repositories/in-memory-receivers-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeUser } from 'test/factories/make-user';
import { UserRole } from '@/domain/delivery/enterprise/entities/user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';

let inMemoryReceiversRepository: InMemoryReceiversRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: UpdateReceiverUseCase;

describe('Update Receiver', () => {
    beforeEach(() => {
        inMemoryReceiversRepository = new InMemoryReceiversRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository()
        sut = new UpdateReceiverUseCase(inMemoryReceiversRepository, inMemoryUsersRepository);
    });

    it('should be able to update an receiver', async () => {
        const receiver = makeReceiver({}, new UniqueEntityID('receiver-1'))
        inMemoryReceiversRepository.items.push(receiver)

        const loggedUser = makeUser({ role: UserRole.ADMIN }, new UniqueEntityID('user-1'))
        await inMemoryUsersRepository.create(loggedUser)

        const result = await sut.execute({
            userId: 'user-1',
            receiverId: 'receiver-1',
            name: 'Cliente novo',
        });

        expect(result.isRight()).toBe(true);
        expect(result.value).toEqual({
            receiver: inMemoryReceiversRepository.items[0]
        });
        expect(inMemoryReceiversRepository.items[0].name).toEqual('Cliente novo');
    });
});