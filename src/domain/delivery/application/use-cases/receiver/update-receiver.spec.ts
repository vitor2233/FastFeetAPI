import { makeReceiver } from 'test/factories/make-receiver';
import { UpdateReceiverUseCase } from './update-receiver';
import { InMemoryReceiversRepository } from 'test/repositories/in-memory-receivers-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryReceiversRepository: InMemoryReceiversRepository;
let sut: UpdateReceiverUseCase;

describe('Update Receiver', () => {
    beforeEach(() => {
        inMemoryReceiversRepository = new InMemoryReceiversRepository();
        sut = new UpdateReceiverUseCase(inMemoryReceiversRepository);
    });

    it('should be able to update an receiver', async () => {
        const receiver = makeReceiver({}, new UniqueEntityID('receiver-1'))
        inMemoryReceiversRepository.items.push(receiver)

        const result = await sut.execute({
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