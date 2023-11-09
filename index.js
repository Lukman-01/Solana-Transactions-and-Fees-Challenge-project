// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction
} = require("@solana/web3.js");


// Making a keypair and getting the private key
const newPair = Keypair.generate();
console.log("Below is what you will paste into your code:\n")
console.log(newPair.secretKey);
 
const DEMO_FROM_SECRET_KEY = new Uint8Array(
    // paste your secret key inside this empty array
    // then uncomment transferSol() at the bottom
    [
        118, 140,  47, 125,   1, 231,  91,  55,  95, 249, 109,
         93,  85,  36, 196,  98,   5, 215,  86, 202, 178,  78,
         71, 230, 197,  43, 191,  43,  47, 189, 109, 137,  38,
        192,  22,  79,  41, 222, 136, 120,   0, 234, 255, 157,
         44, 151,   6, 102,   4,   4, 186, 184, 202,  78, 217,
         56,  41, 207,  79, 157,  28, 132, 220,  86
    ]            
);

const transferSol = async() => {
    const connection = new Connection("http://127.0.0.1:8899", "confirmed");

    // Get Keypair from Secret Key
    var from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);

    // (Optional) - Other things you can try: 
    // 1) Form array from userSecretKey
    // const from = Keypair.fromSecretKey(Uint8Array.from(userSecretKey));
    // 2) Make a new Keypair (starts with 0 SOL)
    // const from = Keypair.generate();

    // Generate another Keypair (account we'll be sending to)
    const to = Keypair.generate();

    // Aidrop 2 SOL to Sender wallet
    console.log("Airdopping some SOL to Sender wallet!");
    const fromAirDropSignature = await connection.requestAirdrop(
        new PublicKey(from.publicKey),
        4 * LAMPORTS_PER_SOL
    );

    // Latest blockhash (unique identifer of the block) of the cluster
    let latestBlockHash = await connection.getLatestBlockhash();

    // Confirm transaction using the last valid block height (refers to its time)
    // to check for transaction expiration
    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: fromAirDropSignature
    });

    console.log("Airdrop completed for the Sender account");

    let fromBalance = await connection.getBalance(from.publicKey);
    console.log("From balance before Transaction", fromBalance);
    let toBalance = await connection.getBalance(to.publicKey);
    console.log("To balance before Transaction", toBalance);

    const fiftyPercent = fromBalance / 2;

    // Send money from "from" wallet and into "to" wallet
    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: fiftyPercent
        })
    );

    // Sign transaction
    var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
    );
    console.log('Signature is', signature);

    let afterfromBalance = await connection.getBalance(from.publicKey);
    console.log("From balance before Transaction", afterfromBalance);
    let aftertoBalance = await connection.getBalance(to.publicKey);
    console.log("To balance before Transaction", aftertoBalance);
}

transferSol();