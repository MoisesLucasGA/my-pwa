import { format } from "date-fns";
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
    paidAt: z.date().optional(),
    price: z.number().min(0),
    createdAt: z.date(),
    isDelivered: z.number(),
    deliveredAt: z.date().optional(),
})

export type Client = z.infer<typeof ClientSchema>
export type Repair = z.infer<typeof RepairSchema>

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

export const updateData = async <T>(storeName: string, data: T): Promise<T | string | null> => {
    return new Promise((resolve) => {
        request = indexedDB.open('myDB', version);
        request.onsuccess = async () => {
            db = await request.result;
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            store.put(data);
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

export const deleteData = async (storeName: string, key: number): Promise<string | boolean> => {
    return new Promise((resolve) => {
        request = indexedDB.open('myDB', version);
        request.onsuccess = async () => {
            db = await request.result;
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const data = store.get(key)

            data.onsuccess = () => {
                if (!data.result) {
                    resolve("Item não encontrado")
                } else {
                    store.delete(key)
                    resolve(true);
                }
            }
            data.onerror = () => {
                resolve(data.error?.message || 'Erro desconhecido')
            }

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

export const getAllData = <T>(storeName: string): Promise<T[] | string> => {
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
                resolve([] as T[])
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

                const clientReq = clientStore.get(repair.clientId || -1);

                clientReq.onerror = () => reject(clientReq.error);

                clientReq.onsuccess = () => {
                    const client = clientReq.result as Client | undefined;

                    repairs.push({
                        ...repair,
                        clientName: client?.name || 'Cliente Não Encontrado',
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

export const ExportData = async () => {
    const repairs = await getAllData<Repair>(Stores.Repairs)
    const clients = await getAllData<Client>(Stores.Clients)

    const data = {
        repairs: typeof repairs === 'string' ? [] : repairs as Repair[],
        clients: typeof clients === 'string' ? [] : clients as Client[]
    }

    const content = JSON.stringify(data)

    const name = `db_${format(new Date(), 'dd-MM-yyy HH_mm_ss')}.json`

    let element = document.createElement('a');
    element.setAttribute('href',
        'data:text/plain;charset=utf-8, '
        + encodeURIComponent(content));
    element.setAttribute('download', name);
    document.body.appendChild(element);
    element.click();

    document.body.removeChild(element);
}

export const ImportData = async (data: Blob) => {
    const content = JSON.parse(await data.text())

    const clients: Client[] = content.clients || []
    const repairs: Repair[] = content.repairs || []

    // Making sure to not add repairs without clients
    if (clients) {
        for (const c of clients) {
            await addData<Client>(Stores.Clients, c)
        }

        for (const r of repairs) {
            const repair: Repair = {
                ...r,
                createdAt: new Date(r.createdAt),
                deliveredAt: r.deliveredAt ? new Date(r.deliveredAt) : undefined,
                paidAt: r.paidAt ? new Date(r.paidAt) : undefined,
            }
            await addData<Repair>(Stores.Repairs, repair)
        }
    }
}