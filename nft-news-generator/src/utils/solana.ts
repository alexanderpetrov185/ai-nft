import { Keypair, Connection } from '@solana/web3.js';
import fs from 'fs';
import { keypairIdentity, Metaplex, irysStorage, toMetaplexFile } from '@metaplex-foundation/js';

const SOLANA_NETWORK = 'https://api.devnet.solana.com'; // Используем Devnet для тестирования

// Генерация нового кошелька
export const generateWallet = (): Keypair => {
    return Keypair.generate();
};

// Выпуск NFT
export const mintNFT = async (wallet: Keypair, imageBuffer: Buffer): Promise<string> => {
    console.log('Используемый публичный ключ кошелька:', wallet.publicKey.toBase58());
    const connection = new Connection(SOLANA_NETWORK, 'confirmed');
    const metaplex = Metaplex.make(connection)
        .use(keypairIdentity(wallet))
        .use(
            irysStorage({
                address: "https://devnet.irys.xyz", // Новый адрес
                providerUrl: "https://api.devnet.solana.com",
                timeout: 60000,
            }),
        );

    const balance = await connection.getBalance(wallet.publicKey);
    console.log('Баланс кошелька:', balance / 10 ** 9, 'SOL');

    // Сохраняем изображение во временный файл
    const tempFilePath = `./output/nft-${Date.now()}.png`;
    fs.writeFileSync(tempFilePath, imageBuffer);

    try {
        // Загружаем изображение в Arweave через Metaplex
        const fileBuffer = fs.readFileSync(tempFilePath);
        const file = toMetaplexFile(fileBuffer, `nft-${Date.now()}.png`);
        const uri = await metaplex.storage().upload(file);

        // Выпускаем NFT
        const { nft } = await metaplex.nfts().create({
            uri,
            name: 'News NFT',
            sellerFeeBasisPoints: 500, // 5% комиссии за перепродажу
        });

        console.log('NFT успешно выпущен!', nft.address.toBase58());
        return nft.address.toBase58(); // Возвращаем адрес NFT
    } finally {
        // Удаляем временный файл
        fs.unlinkSync(tempFilePath);
    }
};
