import * as z from "zod";

let request: IDBOpenDBRequest
let db: IDBDatabase
let version = 3
const phoneRegex = /^\((\d{2})\)\s(\d{1})\s(\d{4})-(\d{4})$/;

export const ClientSchema = z.object({
    id: z.number(),
    name: z.string().trim().min(2, "O nome precisa de pelo menos 2 caracteres"),
    phone: z.union([
        z.literal(""),
        z.string().regex(phoneRegex, "Número inválido"),
    ])
});

export const RepairSchema = z.object({
    id: z.number(),
    clientId: z.number("Escolha um cliente"),
    desc: z.string().trim().min(2, "Adicione uma descrição"),
    isPaid: z.number().optional(),
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

export type RepairResponse = Repair & {
    clientName: string
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

export const addData = async <T>(storeName: string, data: T): Promise<T | string | null> => {
    return new Promise((resolve) => {
        request = indexedDB.open('myDB', version);
        request.onsuccess = async () => {
            db = await request.result;
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
                        clientName: clientReq.result.clientName ?? '',
                        ...repair,
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

export const getAllRepairs = (): Promise<RepairResponse[] | string> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('myDB', version);

        request.onsuccess = () => {
            const db = request.result;
            const tx = db.transaction(
                [Stores.Repairs, Stores.Clients],
                'readonly'
            );

            const repairStore = tx.objectStore(Stores.Repairs);
            const clientStore = tx.objectStore(Stores.Clients);

            const repairs: RepairResponse[] = [];

            const cursorReq = repairStore.openCursor(null, "prev");

            cursorReq.onerror = () => reject(cursorReq.error);

            cursorReq.onsuccess = () => {
                const cursor = cursorReq.result;

                if (!cursor) {
                    resolve(repairs);
                    return;
                }

                const repair = cursor.value as Repair;

                const clientReq = clientStore.get(repair.clientId);

                clientReq.onerror = () => reject(clientReq.error);

                clientReq.onsuccess = () => {
                    const client = clientReq.result as Client | undefined;

                    if (!client) {
                        reject(new Error(`Client ${repair.clientId} not found`));
                        return;
                    }

                    repairs.push({
                        ...repair,
                        clientName: client.name,
                    });

                    cursor.continue();
                };
            };
        };

        request.onerror = () => {
            const error = request.error?.message;
            resolve(error ?? 'Unknown error');
        };
    });
};