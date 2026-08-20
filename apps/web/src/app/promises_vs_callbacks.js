/**
 * VIVA DEMO: Callbacks vs Promises (and Async/Await)
 * 
 * Scenario: 
 * We want to fetch a user, then fetch their bank accounts, 
 * and finally fetch the transactions for the first account.
 * 
 * Run this file using: node viva/promises_vs_callbacks.js
 */

// ==========================================
// 1. Mock Data & Helper Functions (Simulating DB/API calls)
// ==========================================
console.log("--- Starting Viva Demo ---\n");

// --- Callback based mock functions ---
function getUserCallback(userId, callback) {
    setTimeout(() => {
        if (!userId) return callback(new Error("User ID is required"));
        console.log(`[Callback] Fetched user ${userId}`);
        callback(null, { id: userId, name: "Jatin" });
    }, 1000);
}

function getAccountsCallback(userId, callback) {
    setTimeout(() => {
        console.log(`[Callback] Fetched accounts for user ${userId}`);
        callback(null, [{ accountId: 101, type: "Savings" }, { accountId: 102, type: "Current" }]);
    }, 1000);
}

function getTransactionsCallback(accountId, callback) {
    setTimeout(() => {
        console.log(`[Callback] Fetched transactions for account ${accountId}`);
        callback(null, [{ txId: 1, amount: 500 }, { txId: 2, amount: -200 }]);
    }, 1000);
}

// --- Promise based mock functions ---
function getUserPromise(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!userId) return reject(new Error("User ID is required"));
            console.log(`[Promise] Fetched user ${userId}`);
            resolve({ id: userId, name: "Jatin" });
        }, 1000);
    });
}

function getAccountsPromise(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`[Promise] Fetched accounts for user ${userId}`);
            resolve([{ accountId: 101, type: "Savings" }, { accountId: 102, type: "Current" }]);
        }, 1000);
    });
}

function getTransactionsPromise(accountId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`[Promise] Fetched transactions for account ${accountId}`);
            resolve([{ txId: 1, amount: 500 }, { txId: 2, amount: -200 }]);
        }, 1000);
    });
}

// ==========================================
// 2. The Callback Approach (Callback Hell)
// ==========================================
function runCallbackDemo() {
    console.log("=== 1. CALLBACK APPROACH ===");
    
    getUserCallback(1, (err, user) => {
        if (err) {
            return console.error("Error fetching user:", err);
        }
        
        getAccountsCallback(user.id, (err, accounts) => {
            if (err) {
                return console.error("Error fetching accounts:", err);
            }
            
            getTransactionsCallback(accounts[0].accountId, (err, transactions) => {
                if (err) {
                    return console.error("Error fetching transactions:", err);
                }
                
                console.log("[Callback] Final Result:", transactions);
                console.log("--- Callback Demo Complete ---\n");
                
                // Trigger next demo
                runPromiseDemo();
            });
        });
    });
}

// ==========================================
// 3. The Promise Approach (Chaining)
// ==========================================
function runPromiseDemo() {
    console.log("=== 2. PROMISE APPROACH ===");
    
    getUserPromise(1)
        .then(user => {
            return getAccountsPromise(user.id);
        })
        .then(accounts => {
            return getTransactionsPromise(accounts[0].accountId);
        })
        .then(transactions => {
            console.log("[Promise] Final Result:", transactions);
            console.log("--- Promise Demo Complete ---\n");
            
            // Trigger next demo
            runAsyncAwaitDemo();
        })
        .catch(err => {
            console.error("Error in promise chain:", err);
        });
}

// ==========================================
// 4. The Async/Await Approach (Modern Promises)
// ==========================================
async function runAsyncAwaitDemo() {
    console.log("=== 3. ASYNC/AWAIT APPROACH ===");
    
    try {
        const user = await getUserPromise(1);
        const accounts = await getAccountsPromise(user.id);
        const transactions = await getTransactionsPromise(accounts[0].accountId);
        
        console.log("[Async/Await] Final Result:", transactions);
        console.log("--- Async/Await Demo Complete ---\n");
    } catch (err) {
        console.error("Error in async/await:", err);
    }
}

// Start the sequence
runCallbackDemo();
