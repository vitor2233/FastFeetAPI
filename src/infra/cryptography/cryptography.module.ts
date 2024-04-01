import { Module } from "@nestjs/common";
import { BcryptHasher } from "./bcrypt-hasher";
import { JwtEncrypter } from "./jwt-encrypter";
import { Encrypter } from "@/domain/delivery/cryptography/encrypter";
import { HashComparer } from "@/domain/delivery/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/delivery/cryptography/hash-generator";

@Module({
    providers: [
        {
            provide: Encrypter,
            useClass: JwtEncrypter
        },
        {
            provide: HashComparer,
            useClass: BcryptHasher
        },
        {
            provide: HashGenerator,
            useClass: BcryptHasher
        }
    ],
    exports: [Encrypter, HashComparer, HashGenerator]
})
export class CryptographyModule { }