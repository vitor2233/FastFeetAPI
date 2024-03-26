import { InMemoryReceiversRepository } from 'test/repositories/in-memory-receivers-repository';
import { DeleteReceiverUseCase } from './delete-receiver';
import { makeReceiver } from 'test/factories/make-receiver';

let inMemoryReceiversRepository: InMemoryReceiversRepository;
let sut: DeleteReceiverUseCase;

describe('Delete Receiver', () => {
    beforeEach(() => {
        inMemoryReceiversRepository = new InMemoryReceiversRepository();
        sut = new DeleteReceiverUseCase(inMemoryReceiversRepository);
    });

    it('should be able to delete an receiver', async () => {
        const receiver = makeReceiver()
        await inMemoryReceiversRepository.create(receiver)

        await sut.execute({
            receiverId: receiver.id.toString()
        })

        expect(inMemoryReceiversRepository.items).toHaveLength(0)
    });

})