import * as z from "zod";

let request: IDBOpenDBRequest
let db: IDBDatabase
let version = 3

export const ClientSchema = z.object({
    id: z.number(),
    name: z.string().trim().min(2, "O nome precisa de pelo menos 2 caracteres"),
    phone: z.string().regex(/^\((\d{2})\)\s(\d{1})\s(\d{4})-(\d{4})$/gm, "Número inválido"),
});

const RepairSchema = z.object({
    id: z.number(),
    clientId: z.number(),
    desc: z.string(),
    isPaid: z.number(),
    paidAt: z.date().nullable(),
    price: z.number().min(0),
    createdAt: z.date(),
    isDelivered: z.number(),
    deliveredAt: z.date().nullable(),
})

export type Client = z.infer<typeof ClientSchema>
export type Repair = z.infer<typeof RepairSchema>

export interface RepairInter {
    id: number
    clientId: number
    desc: string
    paid: Date | number
    price: number | null
    createdAt: Date
    delivered: Date | null
}

export interface RepairResponse {
    client: Client | null
    repair: Repair
}

export const Stores = {
    Clients: 'clients',
    Repairs: 'repairs'
} as const

export const initDB = (): Promise<boolean> => {
    return new Promise((resolve) => {
        request = indexedDB.open('myDB', version)

        request.onupgradeneeded = () => {
            db = request.result

            if (!db.objectStoreNames.contains(Stores.Clients)) {
                console.log('Creating clients store');
                db.createObjectStore(Stores.Clients, { keyPath: 'id', autoIncrement: true })
            }
            if (!db.objectStoreNames.contains(Stores.Repairs)) {
                console.log('Creating repairs store');
                const repairStore = db.createObjectStore(Stores.Repairs, { keyPath: 'id', autoIncrement: true })
                repairStore.createIndex("clientId", "clientId", { unique: false });
                repairStore.createIndex("isPaid", "isPaid", { unique: false });
                repairStore.createIndex("IsDelivered", "isDelivered", { unique: false });
                repairStore.createIndex("createdAt", "createdAt", { unique: false });
            }
        }

        request.onsuccess = () => {
            db = request.result

            console.log(`initDB success, version: ${db.version}`);

            resolve(true)
        }

        request.onerror = () => {
            console.log(JSON.stringify(request.error));

            resolve(false)
        }
    })

}

export const addData = <T>(storeName: string, data: T): Promise<T | string | null> => {
    return new Promise((resolve) => {
        request = indexedDB.open('myDB', version);

        request.onsuccess = () => {
            db = request.result;
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            store.add(data);
            resolve(data);
        };

        request.onerror = () => {
            const error = request.error?.message
            if (error) {
                resolve(error);
            } else {
                resolve('Erro desconhecido!');
            }
        };
    });
};

export const getAllData = <T>(storeName: string): Promise<T[] | string | null> => {
    return new Promise((resolve) => {
        request = indexedDB.open('myDB', version);

        request.onsuccess = () => {
            db = request.result;
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);

            const data = store.getAll()

            data.onsuccess = () => {
                resolve(data.result);
            }
            data.onerror = () => {
                resolve(null)
            }
        };

        request.onerror = () => {
            const error = request.error?.message
            if (error) {
                resolve(error);
            } else {
                resolve('Unknown error');
            }
        };
    });
};

export const getDataByKey = <T>(storeName: string, key: number): Promise<T | string | null> => {
    return new Promise((resolve) => {
        request = indexedDB.open('myDB', version);

        request.onsuccess = () => {
            db = request.result;
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const data = store.get(key)

            data.onsuccess = () => {
                resolve(data.result || null);
            }
            data.onerror = () => {
                resolve(null)
            }
        };

        request.onerror = () => {
            const error = request.error?.message
            if (error) {
                resolve(error);
            } else {
                resolve('Unknown error');
            }
        };
    });
};


export const getRepair = (key: number): Promise<RepairResponse | null | string> => {
    return new Promise((resolve, reject) => {
        request = indexedDB.open('myDB', version);

        request.onsuccess = () => {
            db = request.result;
            const tx = db.transaction([Stores.Repairs, Stores.Clients], 'readonly');

            const repairStore = tx.objectStore("repairs");
            const clientStore = tx.objectStore("clients");

            const repairReq = repairStore.get(key);

            repairReq.onerror = () => reject(repairReq.error);

            repairReq.onsuccess = () => {
                const repair = repairReq.result as Repair;

                if (!repair) {
                    reject(new Error("Repair not found"));
                    return;
                }

                const clientReq = clientStore.get(repair.clientId);

                clientReq.onerror = () => reject(clientReq.error);

                clientReq.onsuccess = () => {
                    if (!clientReq.result) {
                        reject(new Error("client not found"))
                        return;
                    }

                    resolve({
                        client: clientReq.result as Client ?? null,
                        repair,
                    });
                };
            };

            request.onerror = () => {
                const error = request.error?.message
                if (error) {
                    resolve(error);
                } else {
                    resolve('Unknown error');
                }
            };
        }
    });
};