import { InMemoryReceiversRepository } from 'test/repositories/in-memory-receivers-repository'
import { CreateReceiverUseCase } from './create-receiver'

let inMemoryReceiversRepository: InMemoryReceiversRepository
let sut: CreateReceiverUseCase

describe('Create Receiver', () => {
    beforeEach(() => {
        inMemoryReceiversRepository =
            new InMemoryReceiversRepository()
        sut = new CreateReceiverUseCase(inMemoryReceiversRepository)
    })

    it('should be able to create a receiver', async () => {
        const result = await sut.execute({
            name: 'Vitor',
            address: 'Rua teste, 123',
            latitude: -19.974579,
            longitude: -43.9464643
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            receiver: inMemoryReceiversRepository.items[0]
        })
    })

})